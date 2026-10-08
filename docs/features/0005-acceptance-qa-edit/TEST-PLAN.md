---
approved_by: "Samir dahal"
approved_at: "2026-10-08"
approved_sha256: "3645caabd82c1dac068cd5cf639853bc2c1e3204d132e69b41031175aebc4f4b"
---
# Test Plan 0005 — Edit an expense — Acceptance QA
**Source PRD:** 0002 — docs/features/0002-enhancement-edit/PRD.md (sha256 6f0e2518249f…)
> The QA track of an approved PRD. Written FROM the PRD, never from the code: the tests this plan
> leads to are a second, independent oracle for what the developers build. `lane new` wrote the
> line above and it is part of what you sign — amending the source PRD later reopens
> this gate, so the plan is re-ratified against the requirements it tests.

## Scope
**In:** S-0002.01 in full:
- AC-1: the edit form opens pre-filled with the expense's current amount, category, date and
  note (an absent note shows as empty).
- AC-2: valid changes save and survive a reload; untouched fields keep their values; the
  expense keeps its identity and `created_at`.
- AC-3: zero, negative and non-integer amounts are refused with a message naming the problem,
  the stored expense stays unchanged, and the API refuses them too, not only the browser.
- AC-4: category and date are validated on edit exactly as on create.
- AC-5: dismissing the form leaves the expense untouched.
- AC-6 (the tagged `e2e` AC): open an entry from the list, change amount and category, save,
  and see the new values in the list without a page reload.

**Out:**
- Bulk edit, undo/revert, edit history, audit trail, "last modified" display: out of scope per
  the PRD.
- Delete: already ships and is unchanged; not retested here.
- Live refresh of the summary panel (total spend, spend by category) after an edit: AC-6 asks
  only for the *list* to update live. PRD open question 1 is still unresolved, so this plan
  does not test it. If the dev track builds it into scope, amend the PRD first; the amendment
  reopens this gate and a case is added.
- Note removal (clearing an existing note): PRD open question 3 is unresolved and no AC covers
  it, so this plan does not test it. Same route: a PRD amendment adds the case.
- Where the form lives (inline or modal, PRD open question 2): cases are written against
  accessible roles and labels, so they hold either way.
- Accessibility audits and browsers other than Chromium: not in the PRD's ACs.

## Stories under test
| Story | Acceptance criteria covered | Notes |
|-------|-----------------------------|-------|
| S-0002.01 | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6 | AC-6 is the tagged e2e. AC-3 and AC-4 need an API-level assertion as well as the browser one. Proving `created_at` is unchanged (AC-2) needs the API, because the UI does not show it. |

## Test types
- **Functional e2e** (AC-1, AC-2, AC-5, AC-6): open edit and check the pre-fill (with and
  without a note); change one field and confirm the other three are unchanged; save and
  confirm the list updates in place, then reload and confirm the change persisted; dismiss
  without saving after editing values and confirm nothing changed.
- **Negative and boundary** (AC-3, AC-4), each checked in the browser and through the API, and
  each followed by a re-read showing the stored expense is unchanged:
  - amount: `0`, `-1`, `12.50`, empty, non-numeric. Boundary: `1` (the smallest valid amount)
    must be accepted.
  - category: a value outside {Food, Transport, Bills, Other}, and empty.
  - date: wrong format (`08/10/2026`), an impossible calendar date (`2026-02-30`), and empty.
    Boundary: `2024-02-29` (a leap day) must be accepted.
- **Identity**: after an edit, the API returns the same id and `created_at`, and the list
  still holds one row for that expense, not a new one beside the old one.
- **Double submit**: clicking save twice quickly ends with one edited expense and no
  duplicate row.
- **Smoke**: the AC-6 round trip doubles as the smoke check.

## Environments and test data
- **Runner:** Playwright, version pinned in `e2e/package.json`, Chromium only, run as
  `runner.e2e` (scope `acceptance`).
- **App boot:** Playwright's `webServer` starts the backend and frontend against a fresh,
  throwaway SQLite file for each run. Nothing is started by hand.
- **Test data:** each test creates the expenses it needs at its start (through the API, to keep
  setup fast and independent of the UI under test) and asserts only on those rows. No
  hand-seeded database and no fixtures shared between tests.
- **Accounts:** none. The product is single-user with no auth (PRODUCT.md).
- **Hermetic:** the suite passes from a fresh clone given `setup_cmd` and `replay_env` alone.

## Entry and exit criteria
**Entry:**
- This plan and TEST-CASES.md are both approved.
- The e2e harness (`e2e/` with its Playwright config) is committed on `qa/flow-simple`, and
  `runner.e2e.*` is active in `lane.config` on that branch.
- Before a case's test is written, every 0002 dev task has landed on `qa/flow-simple`, and
  the case's exploration storyboard has a QA-stamped PASS (`lane explore` → `lane approve`).

**Exit:**
- Every automated case is proven: RED on the baseline, GREEN on the integration tip
  (`Lane-Proven-Against`).
- No open defect against any case. A confirmed exploration FAIL is filed as `lane new fix`
  with the storyboard as evidence, and blocks exit until that fix lands.

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Asserting the list before the async save finishes | Passes or fails for the wrong reason | Use Playwright's auto-retrying `expect(...).toHaveText` on the specific row. Never use a fixed sleep. |
| "Without reloading" (AC-6) is satisfied by a hidden reload | The live-update AC passes falsely | Assert that no navigation or document reload happened during save (e.g. a marker set on `window` before saving is still there afterwards). |
| Brittle selectors | Tests break on a harmless UI change | Use roles and labels (`getByRole`, `getByLabel`), which also keeps cases independent of inline vs. modal. |
| State bleeding between tests | One test's row satisfies another test's assertion | Each test creates rows with a unique note or amount and asserts on its own row only. Use a fresh database per run. |
| Browser-only validation masking a permissive API | AC-3 or AC-4 looks green while the API accepts bad data | Every negative case also sends the request straight to the API and re-reads the stored record. |
| A baseline with no running app | RED "fails" because the app never booted, which proves nothing | `test_ran_pattern` must match a failing run, so a RED that never executed a test is refused. |

## Automation strategy
Every case is automated with Playwright. There are no manual cases: each AC is observable
through the UI or the public API. `--retries=0`, so a flaky test fails loudly. Each case is
explored first (a storyboard with a screenshot per step, QA-stamped) before its spec file is
written, and the spec asserts the case's expected results, never what the exploration saw.
Once landed, the specs in `e2e/` become the regression suite and run in CI.
