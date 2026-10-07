---
approved_by: "Samir dahal"
approved_at: "2026-10-07"
approved_sha256: "82670c5cef7ff895909662414c49ec873b485b2866a5f2b1112d14a27117feed"
---
## Verification — Task T-edit-qa-1tggk4 — 2026-10-07
> QA task (ADR-0031). The reviewer reads the TEST against its frozen test case (`snapshot-TSD.md`),
> NOT against the product code. Approve after RED, before GREEN: this stamp fixes what the test
> asserts before it ever meets the feature's code; GREEN is then a plain pass/fail on trunk.
> GATE: owner confirms/dismisses every flag.

✅ **Conformant:** each step and expected result of the test case, and where the test asserts it
- `beforeEach` creates an expense via `POST /api/expenses` and captures `created_at` from the response — matches "creation timestamp is captured immediately after creation via the public API"
- Test navigates to `/` and locates the row by amount (300) and category (Food) — satisfies "Given the test expense exists"
- Opens the edit form via the row's Edit button, fills amount 450, submits — satisfies "When the user edits the amount and saves"
- Waits for the updated row (450) to appear, then calls `GET /api/expenses`, finds the expense by ID, and asserts `created_at === originalCreatedAt` — satisfies "Then the expense's created_at returned by the API equals the value captured at creation"
- `afterEach` deletes the expense via the API — test is self-cleaning

⚠️ **Divergent:** the test asserts something other than the case says + severity (shallow/deep)
- None

❌ **Missing:** a step or expected result of the case the test does not assert
- None — all steps and the expected result are encoded

**Notes (no flags, informational only):**
- Row selector uses `filter({ hasText: "300" }).filter({ hasText: "Food" })` without also filtering on the note "tc-06 test". With `workers: 1` and cleanup in `afterEach`, collision with other tests is negligible in practice. If isolation requirements tighten, adding `.filter({ hasText: "tc-06 test" })` is the safe fix.
- `GET /api/expenses` (list all) is used to fetch the updated expense rather than a direct `GET /api/expenses/{id}`. The spec says "GET /expenses or equivalent" — both are acceptable; the list approach is slightly heavier but correctly exercises the public API.

**Proof:** RED fails on the PRD's baseline (lane red recorded the commit) · GREEN passes the unchanged test on the integration tip (lane green records it — after this stamp)

**Reviewer checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Every expected result of the case is asserted — observable through the UI or the public API only
- [x] The test sets up its own data (no reliance on hand-made state or another test's leftovers)
- [x] No product code changed — test files, page objects, fixtures and harness config only
- [x] No fixed sleeps; selectors are user-facing (role, label, text) — not brittle CSS/XPath
- [x] A manual case: the steps were run by hand and the outcome is written above — N/A: this case is fully automated (Playwright); no hand-run required

**Human verdict:** Conformant. Test faithfully encodes the frozen test case. No flags to resolve. Ready for the human approval stamp.
**Outcome:** clean → GREEN when the feature lands
