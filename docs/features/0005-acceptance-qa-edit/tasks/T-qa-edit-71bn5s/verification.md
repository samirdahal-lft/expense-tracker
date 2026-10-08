---
approved_by: "Samir dahal"
approved_at: "2026-10-08"
approved_sha256: "0c9f2c2a30ab8a590d931e422b181e5e6a12d2b5f5e428f020f73e55cf1588fe"
---
## Verification — Task T-qa-edit-71bn5s — 2026-10-08
> QA task (ADR-0031). The reviewer reads the TEST against its frozen test case (`snapshot-TSD.md`),
> NOT against the product code. Approve after RED, before GREEN: this stamp fixes what the test
> asserts before it ever meets the feature's code; GREEN is then a plain pass/fail on trunk.
> ★GATE: owner confirms/dismisses every flag.

✅ **Conformant:** each step and expected result of the test case, and where the test asserts it (re-review of the re-REDed test)
- Precondition / test data: the test creates its own expense through the public API (`POST /api/expenses`, amount 500, Food, 2026-09-10, note "tc01-lunch") and asserts the 2xx (L17-20). The values match the case exactly.
- Given: the list is opened (L23). Exactly one "tc01-lunch" row exists (L24-25), and it shows 500 (L27) and Food (L28).
- When: the no-reload marker is set before saving (L33-35). The test then clicks the row's Edit button (L36), finds the form by its accessible name "Edit expense" (L37), fills Amount 750 (L38), selects Category Transport (L39) and clicks Save (L40). It uses the UI only.
- Then / Expected: there is still exactly one "tc01-lunch" row (L45-46), so the expense was updated in place, not duplicated. That row shows 750 (L48) and Transport (L49) and no longer contains Food (L50). These are web-first retrying assertions with no fixed sleep, so this is "right after saving".
- No reload / navigation: `window.__noReloadMarker` is read after the save and must still equal its pre-save value (L51-52). A reload or cross-document navigation would destroy the window global, so the proof is sound and is the mechanism the case prescribes. It is read after the row assertions, so a reload that re-drew 750/Transport would still fail.
- Values: every asserted value (500, Food, 750, Transport, one row) comes from the case. The marker string is the test's own sentinel, not a storyboard "Saw" value. The steps walk the storyboard's Steps 1-4 in order.
- Substring checks: "750"/"Transport" cannot appear in the pre-save row (Rs 500 / Food / 2026-09-10 / tc01-lunch). Together with `toHaveCount(1)` and `not.toContainText("Food")` they cannot pass for the wrong reason (old row left in place, duplicate row, or category added rather than replaced).

⚠️ **Divergent:** the test asserts something other than the case says + severity (shallow/deep)
- none open. Status of the earlier flags:
  - [RESOLVED] **deep** — `.last()` masked a duplicate row (an edit that created a new expense could pass). `.last()` is gone. `toHaveCount(1)` is asserted before (L25) and after (L46) the save, plus `not.toContainText("Food")` (L50). A duplicate or un-updated row now fails.
  - [RESOLVED] **shallow** — tag-list CSS row locator (`li, tr, article, [role=listitem], [role=row]`). It is now a single `li` filtered by the note text (L10). This is the semantic list-item element, not a guess across markups. Ambiguity (nested `li`) would fail `toHaveCount(1)` loudly rather than pass falsely. Residual nit, optional: `getByRole("listitem")` is the role-based equivalent.
  - [RESOLVED] **shallow** — form found by `locator("form")` + save-button filter. It is now `getByRole("form", { name: /edit expense/i })` (L37), which is user-facing.
  - [RESOLVED / dismissed] **shallow** — fixed note "tc01-lunch", no cleanup. The note is the case's own test data, so keeping it is correct. Isolation comes from the harness: `e2e/playwright.config` gives each run a fresh SQLite file (`expense-e2e-<pid>.db`), `reuseExistingServer: false`, `retries: 0`, `workers: 1`. No other spec in e2e/tests uses "tc01-lunch". Leftovers cannot collide, and `toHaveCount(1)` would expose one if they did.

❌ **Missing:** a step or expected result of the case the test does not assert
- none

**Proof:** (explored kinds: QA stamped the storyboard PASS first) · RED fails on the PRD's baseline (lane red recorded the commit) · GREEN passes the unchanged test on the integration tip (lane green records it — after this stamp)

**Reviewer checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Every expected result of the case is asserted — observable through the UI or the public API only
- [x] Explored kinds (ADR-0032): the test walks the QA-stamped storyboard's steps (exploration.md), and every asserted value comes from the CASE's expected result — never from a storyboard "Saw" line
- [x] The test sets up its own data (no reliance on hand-made state or another test's leftovers)
- [x] No product code changed — test files, page objects, fixtures and harness config only
- [x] No fixed sleeps; selectors are user-facing (role, label, text) — not brittle CSS/XPath
- [x] A manual case: the steps were run by hand and the outcome is written above — N/A — automated case

**Human verdict:** each item confirmed/dismissed — the lane approve stamp records who signed
**Outcome:** clean → GREEN when the feature lands | divergence → fix the test (a re-RED) and re-review | the case itself is wrong → amend the signed test cases (their gate reopens)
**Critic recommendation:** clean. After the re-RED, the test encodes TC-01 fully and strictly. All four earlier flags are resolved (the deep `.last()` duplicate-masking is fixed by `toHaveCount(1)` before and after the save plus `not.toContainText("Food")`). The diff touches only e2e/tests/tc-01-edit-amount-category-live.spec.ts plus task docs/evidence. No backend/ or frontend/ change.
