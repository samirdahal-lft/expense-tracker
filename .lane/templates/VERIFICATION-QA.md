## Verification — Task <T-ID> — <date>
> QA task (ADR-0031). The reviewer reads the TEST against its frozen test case (`snapshot-TSD.md`),
> NOT against the product code. Approve after RED, before GREEN: this stamp fixes what the test
> asserts before it ever meets the feature's code; GREEN is then a plain pass/fail on trunk.
> ★GATE: owner confirms/dismisses every flag.

✅ **Conformant:** each step and expected result of the test case, and where the test asserts it
-
⚠️ **Divergent:** the test asserts something other than the case says + severity (shallow/deep)
-
❌ **Missing:** a step or expected result of the case the test does not assert
-

**Proof:** (explored kinds: QA stamped the storyboard PASS first) · RED fails on the PRD's baseline (lane red recorded the commit) · GREEN passes the unchanged test on the integration tip (lane green records it — after this stamp)

**Reviewer checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [ ] Every expected result of the case is asserted — observable through the UI or the public API only
- [ ] Explored kinds (ADR-0032): the test walks the QA-stamped storyboard's steps (exploration.md), and every asserted value comes from the CASE's expected result — never from a storyboard "Saw" line
- [ ] The test sets up its own data (no reliance on hand-made state or another test's leftovers)
- [ ] No product code changed — test files, page objects, fixtures and harness config only
- [ ] No fixed sleeps; selectors are user-facing (role, label, text) — not brittle CSS/XPath
- [ ] A manual case: the steps were run by hand and the outcome is written above

**Human verdict:** each item confirmed/dismissed — the lane approve stamp records who signed
**Outcome:** clean → GREEN when the feature lands | divergence → fix the test (a re-RED) and re-review | the case itself is wrong → amend the signed test cases (their gate reopens)
