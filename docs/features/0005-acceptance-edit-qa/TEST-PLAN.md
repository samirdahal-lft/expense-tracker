---
approved_by: "Samir dahal"
approved_at: "2026-10-07"
approved_sha256: "b746725ebbcbcfc69b45549911c43901a057c1eedf5d524adc996e6319e935b6"
---
# Test Plan 0005 — Edit an expense (acceptance)
**Source PRD:** 0002 — docs/features/0002-enhancement-edit/PRD.md (sha256 6f0e2518249f…)
> The QA track of an approved PRD. Written FROM the PRD, never from the code: the tests this plan
> leads to are a second, independent oracle for what the developers build. `lane new` wrote the
> line above and it is part of what you sign — amending the source PRD later reopens
> this gate, so the plan is re-ratified against the requirements it tests.

## Scope
**In:** Story S-0002.01 "Correct a recorded expense", end to end through the running app (browser
and its HTTP API): opening edit from the expense list, the pre-filled form, saving valid changes,
persistence across reload, identity and `created_at` preservation, amount / category / date
validation (in the browser and at the API), dismissing without saving, and the list updating live.
**Out:**
- Bulk edit, undo/revert, edit history / "last modified" — PRD out of scope.
- Delete — ships in 0001 and is unchanged by this PRD; covered only as test-data cleanup, not asserted.
- Summary (total / by-category) refresh after an edit — PRD open question 1 is unresolved and no AC
  requires it. *(Proposed — confirm or move to In.)*
- Clearing an existing note — PRD open question 3 is unresolved, so there is no requirement to assert.
  *(Proposed — confirm or supply the rule.)*
- Inline-vs-modal form placement — left to the TSD; tests locate the form by role and label so either passes.
- Category management — PRODUCT.md mentions it, but this PRD fixes the set to Food, Transport, Bills, Other.

## Stories under test
| Story | Acceptance criteria covered | Notes |
|-------|-----------------------------|-------|
| S-0002.01 | AC-1 pre-filled form | Includes an expense with no note → note field empty, and one with a note → shown verbatim. |
| S-0002.01 | AC-2 persist + survive reload | Change one field only; assert the other three unchanged after reload. Identity and `created_at` checked via the API (they are not shown in the UI). |
| S-0002.01 | AC-3 amount rejection (UI + API) | Boundaries: `0`, `-1`, `12.50`, `1` (smallest valid). API: PUT/PATCH with each bad amount directly, bypassing the browser → refused, and stored row unchanged. |
| S-0002.01 | AC-4 category + date validation | Category outside the fixed set (API), date `2026-02-30`, `2026-13-01`, `07/10/2026`, empty → refused, row unchanged. |
| S-0002.01 | AC-5 dismiss leaves untouched | Edit fields, then dismiss (cancel / Escape / close) → list and reload show the original values. |
| S-0002.01 | AC-6 [e2e] list updates live | The PRD's own flow: open entry, change amount + category, save, assert the list row without a reload (no navigation event). |

Implied negative cases (PRD does not spell these out):
- Double submit: clicking Save twice quickly produces one update and no duplicate row.
- Editing one expense does not change any other expense in the list.
- Editing a non-existent id at the API is refused (not-found) and creates nothing.

## Test types
- **Functional e2e** — AC-1, AC-2, AC-5, AC-6 through the browser.
- **Negative / boundary** — AC-3 and AC-4 in the browser (message shown, nothing saved) and directly
  against the API (the "holds at the API" half of AC-3, and AC-4's "not a bypass").
- **Smoke** — the AC-6 case doubles as the smoke check that edit is reachable at all.
- Not planned: accessibility audit, cross-browser (single-user local app; Chromium only). *(Proposed.)*

## Environments and test data
- The app booted by Playwright's `webServer` (backend + frontend) against a **throwaway SQLite file**
  created for the run, never a developer's database.
- Chromium only.
- Every test creates the expense(s) it edits through the API in its own setup and reads them back
  through the API. No hand-seeded data and no fixed ids; tests do not depend on the list being empty
  or on each other's order.
- No accounts: the product is single-user with no authentication.

## Entry and exit criteria
**Entry:**
- This plan stamped.
- An e2e harness (Playwright, pinned in its own `e2e/` package) and a `runner.e2e` entry
  (`scope: acceptance`, `--retries=0`, `test_ran_pattern` that also matches a failing run) committed
  to the integration branch before the first QA `lane red`. **Today neither exists.**
- `setup_cmd` / per-runner setup able to install deps and the browser in a fresh worktree.

**Exit:**
- Every test case in TEST-CASES.md proven: RED on the PRD baseline, reviewed and stamped, GREEN on the
  integration tip.
- Any GREEN failure after 0002 has landed is filed as a defect (`lane new fix`) with the case as evidence.

## Risks
- **Selector drift** — the form's placement is undecided (inline vs modal). Mitigation: locate by
  accessible role and label text (the field names from the PRD: Amount, Category, Date, Note; buttons
  Edit / Save / Cancel), never CSS or test-ids the PRD does not promise. If the UI has no accessible
  labels, that is a finding, not a reason to fall back to CSS.
- **"Without reloading" proven loosely** — a test could pass after an implicit reload. Mitigation:
  assert no navigation occurred (the same page object, no `load` event) between Save and the assertion.
- **Timing** — asserting before the save round trip finishes. Mitigation: web-first assertions
  (`expect(...).toHaveText`) or waiting on the save response; no fixed sleeps.
- **Shared state** — leftover rows from other tests. Mitigation: a fresh DB file per run, and each
  test finds its own row by unique values (e.g. a unique note), not by position.
- **Baseline boot** — QA RED runs on the PRD baseline commit, where edit does not exist; the app
  must still boot there or RED is refused. Mitigation: the harness boots only what the baseline
  already has (0001's app).

## Automation strategy
All cases above are Playwright (UI via `page`, API cases via Playwright's `request` context against
the same booted server). No manual cases planned. `retries: 0` so a flake fails loudly.
