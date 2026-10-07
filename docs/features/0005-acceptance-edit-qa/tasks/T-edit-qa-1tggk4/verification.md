---
approved_by: "Samir dahal"
approved_at: "2026-10-07"
approved_sha256: "7596980bd45db17c19d5b6bceaa9ce842cc7744a2ad005693b26f98b57010ce5"
---
## Verification — Task T-edit-qa-1tggk4 — 2026-10-07
> QA task (ADR-0031). The reviewer reads the TEST against its frozen test case (`snapshot-TSD.md`),
> NOT against the product code. Approve after RED, before GREEN: this stamp fixes what the test
> asserts before it ever meets the feature's code; GREEN is then a plain pass/fail on trunk.
> GATE: owner confirms/dismisses every flag.

✅ **Conformant:** each step and expected result of the test case, and where the test asserts it
- `beforeEach` creates an expense via `POST /api/expenses` and captures `created_at` from the response — matches "creation timestamp is captured immediately after creation via the public API"
- Test navigates to `/` and clicks `getByRole('button', { name: 'Edit Food expense of Rs 300' })` — selects the specific expense by its rendered aria-label; satisfies "Given the test expense exists"
- Scopes to `getByRole('form', { name: 'Edit expense' })` (both the add form and edit form share the "Amount (NPR)" label); fills the edit form's amount field with 450 and clicks "Save changes" — satisfies "When the user edits the amount and saves"
- Waits for `getByRole('button', { name: 'Edit Food expense of Rs 450' })` to be visible (list updated) — confirms the edit took effect in the UI
- Calls `GET /api/expenses`, finds the expense by ID, asserts `created_at === originalCreatedAt` — satisfies "Then the expense's created_at returned by the API equals the value captured at creation"
- `afterEach` deletes via `DELETE /api/expenses/{id}` — hermetic teardown

⚠️ **Divergent:** the test asserts something other than the case says + severity (shallow/deep)
- None

❌ **Missing:** a step or expected result of the case the test does not assert
- None — all steps and the expected result are encoded

**Notes (informational, no flags):**
- First RED used `getByRole('row')` (no table); second RED used `getByLabel('Amount (NPR)')` which matched both the add form and the edit form. This re-RED scopes to `getByRole('form', { name: 'Edit expense' })` before filling the field — strict-mode compliant and semantically correct.
- `GET /api/expenses` (list) is used per "GET /expenses or equivalent" in the case.

**Proof:** RED fails on the PRD's baseline (lane red recorded the re-anchored commit) · GREEN passes the unchanged test on the integration tip (lane green records it — after this stamp)

**Reviewer checklist:**
- [x] Every expected result of the case is asserted — observable through the UI or the public API only
- [x] The test sets up its own data (no reliance on hand-made state or another test's leftovers)
- [x] No product code changed — test files, page objects, fixtures and harness config only
- [x] No fixed sleeps; selectors are user-facing (role, label, aria-label text) — not brittle CSS/XPath
- [x] A manual case: the steps were run by hand and the outcome is written above — N/A: fully automated (Playwright)

**Human verdict:** Conformant. Refined selectors correctly target the UI's semantic attributes. No flags. Ready for approval stamp.
**Outcome:** clean → GREEN when the feature lands
