---
approved_by: "Samir dahal"
approved_at: "2026-10-07"
approved_sha256: "bdcee9c5392d2dc0112be777d187d1d43730218eca06c5fc6ba8c1694d965030"
---
## Verification — Task T-edit-qa-1tggk4 — 2026-10-07
> QA task (ADR-0031). The reviewer reads the TEST against its frozen test case (`snapshot-TSD.md`),
> NOT against the product code. Approve after RED, before GREEN: this stamp fixes what the test
> asserts before it ever meets the feature's code; GREEN is then a plain pass/fail on trunk.
> GATE: owner confirms/dismisses every flag.

✅ **Conformant:** each step and expected result of the test case, and where the test asserts it
- `beforeEach` creates an expense via `POST /api/expenses` and captures `created_at` from the response — matches "creation timestamp is captured immediately after creation via the public API"
- Test navigates to `/` and clicks `getByRole('button', { name: 'Edit Food expense of Rs 300' })` — selects the specific expense by its rendered aria-label; satisfies "Given the test expense exists"
- Fills `getByLabel('Amount (NPR)')` with 450 and clicks `getByRole('button', { name: 'Save changes' })` — satisfies "When the user edits the amount and saves"
- Waits for `getByRole('button', { name: 'Edit Food expense of Rs 450' })` to be visible (list updated) — confirms the edit took effect in the UI
- Calls `GET /api/expenses`, finds the expense by ID, asserts `created_at === originalCreatedAt` — satisfies "Then the expense's created_at returned by the API equals the value captured at creation"
- `afterEach` deletes via `DELETE /api/expenses/{id}` — hermetic teardown

⚠️ **Divergent:** the test asserts something other than the case says + severity (shallow/deep)
- None

❌ **Missing:** a step or expected result of the case the test does not assert
- None — all steps and the expected result are encoded

**Notes (informational, no flags):**
- Previous RED used `getByRole('row')` which doesn't match the list's `<li>` structure. This re-RED uses the aria-label on the Edit button (`"Edit Food expense of Rs 300"`) — a semantic, user-facing selector that won't break on class rename.
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
