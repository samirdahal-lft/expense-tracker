---
approved_by: "Samir dahal"
approved_at: "2026-10-07"
approved_sha256: "1b1d8c1e4548c23a957225bb3a868a100b5774f5be7a7727ac27e4cc43acabb8"
---
# Test Plan 0005 — Edit an expense — Acceptance QA
**Source PRD:** 0002 — docs/features/0002-enhancement-edit/PRD.md (sha256 6f0e2518249f…)
> The QA track of an approved PRD. Written FROM the PRD, never from the code: the tests this plan
> leads to are a second, independent oracle for what the developers build. `lane new` wrote the
> line above and it is part of what you sign — amending the source PRD later reopens
> this gate, so the plan is re-ratified against the requirements it tests.

## Scope
**In:** S-0002.01 in full — the edit form pre-fill (AC-1), saving valid changes and persistence
across reload (AC-2), API-level amount rejection (AC-3), category and date validation parity with
creation (AC-4), cancel/dismiss without side effects (AC-5), and the full end-to-end edit-and-see
flow in the running app (AC-6).

**Out:**
- Bulk edit, undo/revert, edit history, audit trail — out of scope per PRD.
- Delete — already ships and unchanged; not retested here.
- Summary panel (total spend, spend-by-category) live refresh after an edit — the PRD marks
  AC-6 as requiring only the expense *list* to update live; summary refresh remains a PRD open
  question. If the TSD resolved it in scope, raise a PRD amendment before adding a test case here.
- Accessibility and cross-browser coverage beyond Chromium — deferred; not in the PRD ACs.
- Note-removal behavior (clearing a note field) — **GAP: see Risks below; resolve before
  TEST-CASES are written.**

## Stories under test
| Story | Acceptance criteria covered | Notes |
|-------|-----------------------------|-------|
| S-0002.01 | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6 | AC-3 and AC-4 need API-level assertion (not just browser); AC-6 is the tagged e2e |

## Test types
- **Functional e2e** — happy-path flows through the running app (AC-1, AC-2, AC-5, AC-6):
  open the edit form, verify pre-fill, change values, save, confirm the list reflects the update
  without a page reload, and confirm persistence after a reload.
- **Negative / boundary** — invalid input rejection (AC-3, AC-4): zero amount, negative amount,
  decimal amount, invalid category value, malformed date, missing required fields. All must be
  refused with an error message and the stored record must remain unchanged; rejection must hold
  at the API, not only in the browser.
- **Smoke** — a minimal end-to-end round trip confirming the edit endpoint is reachable and the
  list refreshes; run as a fast pre-check before the full suite.

## Environments and test data
- **Runner:** Playwright (pinned version), Chromium only.
- **App boot:** Playwright's `webServer` directive boots the full app (frontend + backend) before
  any test; no separate manual startup.
- **Test data:** every test creates its own expense via the app's create flow (or API, if faster)
  at the start of each test and deletes or isolates it at teardown. No hand-seeded database
  records; no shared accounts. Each test is self-contained and hermetic — the suite must pass
  from a fresh clone given `setup_cmd` + `replay_env` alone.
- **Accounts:** a single test user created by the test run itself (or a fixed seed in `replay_env`);
  never a shared human account.

## Entry and exit criteria
**Entry:**
- This TEST-PLAN is approved (approved_by stamped).
- TEST-CASES.md is approved.
- The e2e harness (`runner.e2e`) is committed to trunk and `lane start` probes it successfully.
- All dev tasks for feature 0002 have landed on `master` (QA track runs against the integration tip).
- `replay_env` in lane.config boots the app deterministically in a fresh tree.

**Exit:**
- Every P1 test case has a proven GREEN commit on trunk (Lane-Proven-Against the integration tip).
- No open defect filed against a P1 case.
- P2/P3 cases either proven or explicitly deferred with a filed issue.

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Async list update timing after save | Test asserts stale list state | Wait for the specific row's new values to appear (Playwright `waitForText` / `toHaveText`), never a fixed `sleep` |
| Selector brittleness (form fields, list rows) | Tests break on UI refactor | Use `data-testid` attributes; avoid CSS class selectors |
| Shared state between tests | One test's created expense bleeds into another | Each test creates and tears down its own record; tests run in isolation (no `storageState` sharing) |
| **GAP — note-removal behavior** | Missing or wrong test case for the note field | The PRD recommends "clearing a note removes it" but did not finalize this as an AC. **Resolve before writing TEST-CASES:** should clearing the note field in the edit form remove an existing note, or leave it unchanged? (See Open questions below.) |

## Automation strategy
All test cases in this plan are automated with Playwright (Chromium). There are no manual cases —
every AC in S-0002.01 is observable through the UI or the public API, so `Tests: N/A — manual`
does not apply to any case here. Retries: 0 on every case so a flake fails loudly rather than
masking intermittent failure.

## Open questions (must resolve before TEST-CASES.md is authored)
1. **Note removal:** Does clearing the note field in the edit form and submitting remove an existing
   note from the stored expense? The PRD recommends yes, but this was not captured as a formal AC.
   Answer determines whether we write a positive test case (clearing removes it), a negative one
   (clearing is a no-op), or both.
2. **Summary refresh:** Did the TSD add a requirement for the total-spend and spend-by-category
   summary panel to refresh live after an edit? If yes, this plan's scope Out entry must move to
   In and a test case must be written. If no, the PRD scope stands.
