---
approved_by: "Samir dahal"
approved_at: "2026-10-06"
approved_sha256: "8593fb722f84ab59c0bf2f681baf3d9d8321b9c29cb23e8d3c4752001cfee47a"
---
# Test Plan 0005 — Edit an Expense (Acceptance)
**Source PRD:** 0002 — docs/features/0002-enhancement-edit/PRD.md (sha256 6f0e2518249f…)
> The QA track of an approved PRD. Written FROM the PRD, never from the code: the tests this plan
> leads to are a second, independent oracle for what the developers build. `lane new` wrote the
> line above and it is part of what you sign — amending the source PRD later reopens
> this gate, so the plan is re-ratified against the requirements it tests.

## Scope
**In:** Story S-0002.01 — all six acceptance criteria covering the full edit flow: form pre-fill,
save with persistence, amount/category/date validation, cancel/dismiss, and the live-update
end-to-end round trip. Also covers the implied boundary and negative cases each AC implies.
Summary-stats refresh after edit is included (PRD recommends it; a visibly wrong total reads
as a bug regardless of scope wording — decision noted here, not deferred).

**Out:**
- Bulk edit — explicitly out of PRD scope.
- Undo / revert of an edit — explicitly out of PRD scope.
- Edit history, audit trail, "last modified" display — explicitly out of PRD scope.
- Delete — already ships; unchanged by this work; covered by prior QA if any.
- Cross-browser beyond Chromium — single-browser run is sufficient for this scope; a
  cross-browser matrix is a separate future concern.
- Accessibility (ARIA, keyboard nav) — not in any PRD AC; deferred.

## Stories under test
| Story | Acceptance criteria covered | Notes |
|-------|-----------------------------|-------|
| S-0002.01 | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6 | All ACs automated; see cases below. One open PRD question resolved: clearing the note field removes the note (PRD recommendation adopted). |

**Acceptance criteria → test cases mapping:**

| AC | What it asserts | Priority | Test type |
|----|----------------|----------|-----------|
| AC-1 | Edit form opens pre-filled with the expense's current values; no field blank when a value exists; absent note shows empty | P1 | functional e2e |
| AC-2 | Saving valid changes persists them; survives page reload; untouched fields keep existing values; `created_at` unchanged | P1 | functional e2e |
| AC-3 | Amount = 0, negative, fractional (12.50), non-numeric all rejected with a named message; stored expense unchanged; rejection enforced at API | P1 | negative / boundary |
| AC-4 | Category must be one of Food / Transport / Bills / Other; date must be valid YYYY-MM-DD; both enforced on edit as on create | P1 | negative / boundary |
| AC-5 | Dismissing the form without submitting leaves the expense untouched (no mutation) | P1 | functional e2e |
| AC-6 | Full round trip: view list → open expense → change amount + category → save → updated values visible in list without reload | P1 | functional e2e (smoke) |
| implied by AC-6 | Summary stats (total spend, spend-by-category) update in the same interaction as the save | P2 | functional e2e |
| implied by AC-2 | Clearing an existing note field and saving removes the note (does not leave the old value) | P2 | functional e2e |

**Boundary cases the PRD implies but does not enumerate:**
- Amount = 1 NPR (minimum valid) — must pass.
- Amount = very large integer (e.g. 9999999) — must pass if positive whole number.
- Date = Feb 29 on a non-leap year — must be rejected as invalid calendar date.
- Date = Feb 29 on a leap year — must be accepted.
- Note = empty string on create + editing to non-empty — must save.
- Submitting the form unchanged (no field touched) — must succeed without error (AC-2: untouched fields keep existing values).

## Test types
- **Functional e2e (Playwright):** Covers the happy paths for AC-1, AC-2, AC-5, AC-6, and the
  implied cases. The app runs via Playwright's `webServer`; tests drive the real UI.
- **Negative / boundary (Playwright):** Covers AC-3, AC-4 and the enumerated boundary values.
  Each invalid input is submitted through the UI; the test asserts the rejection message and
  verifies the stored expense is unchanged by re-fetching (reload or API call).
- **Smoke:** AC-6 doubles as the smoke case — the canonical user journey from list to edit to
  visible update. It runs first; if it fails, the rest are skipped.

No manual cases: every AC is automatable from the PRD description alone.

## Environments and test data
- **App:** Playwright `webServer` boots the full stack (frontend + backend + DB) from the repo
  root. No shared instance, no hand-seeded database. Each test file seeds its own expense(s)
  via the app's own create flow or API endpoint at test setup, and tears them down (or relies
  on a per-test isolated DB state) at teardown.
- **Browser:** Chromium (Playwright default).
- **Accounts / auth:** If the app has auth, each test creates or reuses a test-local account.
  No shared credentials, no production account.
- **Seed data:** Each test that needs a pre-existing expense creates it in `beforeEach` via
  the app's create endpoint; no fixture file with hard-coded IDs.

## Entry and exit criteria
**Entry:**
- PRD 0002 is approved (sha256 bound in this file's header — confirmed).
- The Playwright e2e harness is committed to the integration branch and passing on a clean run.
- The dev feature (0002-enhancement-edit) has no remaining unclaimed tasks — all tasks done
  or landed before `lane green` on any QA task runs (acceptance mode: awaiting-feature blocks
  GREEN while dev tasks remain).

**Exit:**
- Every P1 test case proven on the integration branch tip (lane GREEN recorded).
- Every P2 case proven or a `Tests: N/A — manual test case` card ratified for each deferral.
- No open defect filed against this feature without a linked fix task.
- Verification report stamped by a human.

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Selector brittleness (edit button, form fields identified by position not role) | Flaky on refactor | Use ARIA roles / `data-testid` attributes; fail loudly, retries: 0 |
| Shared DB state between tests | Test A's edit bleeds into Test B's assertion | Each test seeds its own expense; use isolated DB per test or clean up in afterEach |
| Timing: save → list update race | Intermittent failure on AC-6 list assertion | `waitForSelector` / `waitForResponse` on the PATCH response before asserting list |
| `created_at` assertion fragility | Clock skew in CI | Assert `created_at` unchanged by comparing to the value read before edit, not to a hard-coded timestamp |
| API-level rejection (AC-3) not tested | UI could swallow the error | Assert HTTP status (422/400) directly alongside the UI message; use Playwright `route` intercept or a direct fetch |
| App not fully booted when first test runs | First test fails spuriously | `webServer: { waitForPort }` in Playwright config; entry criterion above |

## Automation strategy
All cases are Playwright (TypeScript). Retries: 0 — a flaky test fails the run loudly so
the cause is found and fixed, not silently retried away.

File layout (to be confirmed at test-case authoring):
- `e2e/edit-expense/happy-path.spec.ts` — AC-1, AC-2, AC-5, AC-6, implied cases
- `e2e/edit-expense/validation.spec.ts` — AC-3, AC-4, boundary cases

No manual cases. If a gap is discovered at authoring time that cannot be automated (e.g.
requires visual inspection of a third-party widget), a `Tests: N/A — manual test case` card
is filed and ratified at approve-cards.

**Resolved open questions (documented here, not deferred):**
1. Summary refresh after edit: **included** — a visibly wrong total reads as a bug.
2. Note removal on clear: **tested** — clearing an existing note saves it as absent/empty.
3. Form location (modal vs inline): **form-agnostic at plan level** — selectors are chosen
   at test-case authoring once the implementation is known.
