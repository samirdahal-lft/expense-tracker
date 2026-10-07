You are writing the TEST CASES for an approved test plan. Read the plan this kind signed before
this document, and the PRD its `**Source PRD:**` line names. `lane` names this file.

Write ONE `## TSD S-<FEAT>.nn — TC-nn: <title>` section per test case — the header shape is
load-bearing: each section becomes one task, and the Critic reviews that task's test against
exactly that section. Number the story ids in step with the cases (S-<FEAT>.01 — TC-01,
S-<FEAT>.02 — TC-02, …); never give two cases one id — `lane approve` refuses it.

- Derive every case from the PRD's acceptance criteria, `e2e`-tagged ones first. Fill
  **Covers** with the source story and AC id it proves (e.g. S-0003.01 AC-2), so coverage can be
  counted.
- Add the negative and boundary cases the plan names — one case each, never folded into a
  happy path.
- **Steps** are Given / When / Then in the user's terms. **Expected result** is observable
  through the UI or the public API only — never a table row, a log line or a function call.
- **Automation:** `playwright` unless a human genuinely has to look (visual judgement, a
  physical device). A `manual` case becomes a `Tests: N/A — manual test case` card.
- Black-box only: do NOT read the source code or the unit tests.
- The same holds when the tests are written and fixed: you may read the PRD, the test case,
  `e2e/` and `e2e/test-results/` — never `frontend/` or `backend/`. When a test fails, find out
  why ONLY from `e2e/test-results/<test>/` (`error-context.md` — the page as text — and the
  screenshot). After a failure change only how the test finds things (locators: role, label,
  text), never what it checks; if the check itself is wrong, amend this document and get it
  re-approved.

Ask me each gap as a direct question and wait for my answer. Update THIS file in place.

When all gaps are resolved, say exactly: "assist complete — ready to approve."
