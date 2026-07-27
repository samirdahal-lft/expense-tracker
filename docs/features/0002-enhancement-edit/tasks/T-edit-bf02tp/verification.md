---
approved_by: "Samir dahal"
approved_at: "2026-07-27"
approved_sha256: "3a8cf3f8163d7a5eb80b94f66f4263e60ff8c71414f7828aea24e15f4aa2935a"
---
## Verification — Task T-edit-bf02tp — 2026-07-27
> Critic anchored to TSD (external spec), NOT to the code. ★GATE: owner confirms/dismisses every flag.

> **READ THIS FIRST — the independent Critic has NOT been run.** `critic_cmd` is unset in
> lane.config, so the two routes lane offers are a fresh-context subagent or a human. This session
> is under a standing instruction not to spawn subagents unless asked, so neither has happened.
> Everything below was written by the same session that wrote the code, which is exactly the
> AI-to-AI circularity the Critic exists to break (philosophy §3). Treat the conformance claims as
> the author's self-report — evidenced, but not independently reviewed. This is the open flag in
> the "Suspected hallucination" section; it is the human's to resolve before `lane approve`.

✅ **Conformant:** items matching spec
- **AC-1 [behavior]** — a valid update persists exactly the submitted amount, category, date and
  note; asserted through the HTTP interface against a real temp SQLite store, by a *subsequent
  read* rather than the write's echo (`test_update_persists_new_values_and_keeps_identity`).
  Also exercised by hand against a live uvicorn server on a real DB file — see Smoke below.
- **AC-2 [invariant]** — identity survives: the same test asserts `id` and the original
  `created_at` are unchanged and the row count is still 1. Structurally reinforced two ways —
  `created_at` and `id` are absent from the UPDATE statement's SET clause, and the request model
  has no field that could carry them, so no request can express a change to either.
- **AC-3 [invariant]** — amount 0, -100 and 12.5 are each refused 422 with `amount` named in the
  error's `loc`, and the stored row is byte-for-byte unchanged after each attempt. Refused at the
  API: the assertions run against the backend, not the browser. Confirmed live: a real `PUT` with
  amount 0 returned `422 {"loc":["body","amount"],"msg":"Input should be greater than 0"}`.
- **AC-4 [invariant]** — category "Groceries" and dates "not-a-date" and "2026-02-30" are refused
  on the same terms. The parametrized test additionally POSTs each bad body to the *create*
  endpoint and asserts it is refused there too, so "editing is not a validation bypass" is
  asserted as parity rather than assumed. Structurally, `ExpenseUpdate` subclasses `ExpenseCreate`
  — one validation definition, so the two paths cannot drift apart.
- **AC-5 [behavior]** — an unknown id returns 404 and mutates nothing: the test asserts no upsert
  occurred (count still 1) and the existing row is untouched. Confirmed live (404).
- **AC-6 [behavior]** — opening edit on a listed row presents a form seeded with all four current
  values; a second test covers the absent-note case and asserts the field is present *and* empty,
  not missing. Driven through the real component tree from a list-row click.
- **AC-7 [behavior]** — submitting a whitespace-only note clears it: the listed note disappears,
  the PUT body carries an emptied note rather than omitting the field, and the other three fields
  are asserted unchanged. Confirmed live: a `PUT` omitting note returned `"note": null`.
- **AC-8 [behavior]** — dismissing issues no update request at all (asserted over the fetch mock's
  full call list, not a call-count on a collaborator), the form closes, the row is unchanged, and
  re-opening shows stored values rather than the abandoned draft.
- **AC-9 [e2e]** — driven as two halves, because a green component test alone is not reachability:
  the store half (BF-1) asserts an amount moving between categories reconciles in `/api/summary`
  against real SQLite; the UI half (B-7) asserts the row *and* the summary panel both re-reflect
  the change in one interaction with no reload.
- **Conventions** — `router → service → repository → SQLite` respected (no SQL outside the
  repository, no logic in the router); Pydantic at the API boundary; amounts integer whole NPR
  throughout; the frontend reaches the API only through the typed client; Tailwind utilities only.

⚠️ **Divergent:** deviation + severity (shallow/deep)
- **The exec plan promised 8 RED→GREEN behaviors; the ledger has 7 plus 1 back-fill.** *Shallow.*
  The planned "summary reconciles" behavior could not be driven test-first: once B-1 made the
  update path write the row, reconciliation followed with no further code, so its test passed
  before it was written. Rather than manufacture a failure or quietly drop the TSD-mandated
  integration test, it was recorded with `lane red --backfill` — off-ledger and counted apart.
  `lane verify` reports it explicitly. `planned_behaviors` was corrected 8 → 7 (frontmatter only,
  which does not reopen the plan gate); the plan's prose still reads "8", and the behavior spec
  documents the correction under BF-1.
- **B-7's RED was re-anchored after its first GREEN.** *Shallow.* `npm run build` runs `tsc` over
  `src`, which includes test files, and an untyped callback in the B-7 helper broke the build. The
  first attempt to fix it was a plain commit; `lane verify` correctly refused it (a plain commit
  may not edit a proven test file), so the work was `git reset --soft`ed and re-routed through
  `lane red` → `lane green`. The corrected test is now the RED anchor and still failed for the
  real reason. Nothing was force-pushed — the remote held only the claim commit. Two consecutive
  `B-4 RED` commits in the log are the same mechanism, from a test-selector fix.
- **`EditExpenseForm` duplicates most of `AddExpenseForm`'s markup and its `inputClass`.**
  *Shallow.* Left as-is deliberately: extracting a shared form or constant would touch
  `AddExpenseForm.tsx`, which the approved plan's "PR will contain" list does not include. Flagged
  as a follow-up rather than taken unilaterally.

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- **OPEN FLAG — no independent Critic reviewed this diff.** See the note at the top. The
  conformance section is an author self-report. To resolve, either have a fresh-context reviewer
  read `snapshot-TSD.md` plus `git diff master...T-edit-bf02tp` (and nothing else), or accept the
  weaker trail knowingly. I can run that reviewer as a subagent on request.

❌ **Missing:** acceptance criteria not addressed
- None of the nine ACs is unaddressed.
- **Beyond the ACs, one gap worth knowing about:** no AC covers what the user sees when a save is
  *rejected* by the API. The form does catch the failure and render the message rather than
  crashing on an unhandled rejection — that error path is implementation the ACs did not ask for
  and no test drives it. Disclosed rather than silently shipped; a natural follow-up card.

**TDD cycle log:**
| Behavior | RED ✅ | GREEN ✅ | Test = behavior not impl | Public interface only | Mocks @ boundary only |
|----------|--------|---------|--------------------------|----------------------|----------------------|
| B-1: valid update persists; identity preserved (AC-1, AC-2) | ✅ | ✅ | ✅ asserts a subsequent read, not the echo | ✅ HTTP via TestClient | ✅ real SQLite, nothing mocked |
| B-2: refuses what create refuses (AC-3, AC-4) | ✅ | ✅ | ✅ asserts refusal + unchanged row + parity with create | ✅ HTTP | ✅ real SQLite |
| B-3: unknown id → not-found, no upsert (AC-5) | ✅ | ✅ | ✅ asserts store unchanged, not a call | ✅ HTTP | ✅ real SQLite |
| BF-1: summary reconciles across a category move (AC-9 store half) | ➖ back-fill | ➖ | ✅ asserts summary totals | ✅ HTTP | ✅ real SQLite |
| B-4: open edit → form seeded from the row (AC-6) | ✅ (re-anchored once) | ✅ | ✅ asserts rendered values | ✅ via list-row click | ✅ only `fetch` stubbed |
| B-5: emptied note is cleared, not preserved (AC-7) | ✅ | ✅ | ✅ asserts the row + the wire payload | ✅ real form + client | ✅ only `fetch` stubbed |
| B-6: dismiss issues no request (AC-8) | ✅ | ✅ | ✅ asserts absence of any PUT in the call list | ✅ real form | ✅ only `fetch` stubbed |
| B-7: list + summary re-reflect, no reload (AC-9 UI half) | ✅ (re-anchored once) | ✅ | ✅ asserts both views' rendered totals | ✅ whole App tree | ✅ only `fetch` stubbed |

`lane verify`: **7 behaviours replayed RED→GREEN in a fresh worktree with the test text unchanged**,
plus 1 disclosed back-fill. Ledger coverage audit passed — no source rides a plain commit.
Full suites green: backend 21 passed, frontend 16 passed. `npx tsc --noEmit` clean.

**Smoke / real-boundary evidence (AC-9, and the Boundaries section of the plan):**
Run against a live `uvicorn` server on a real SQLite file — not TestClient, not a stub:
create → `PUT` moving Food 1000 → Transport 2500 → `created_at` preserved verbatim; `/api/summary`
went from `Food 1000 / total 1000` to `Food 0, Transport 2500 / total 2500`; amount 0 → 422 naming
`amount`; date `2026-02-30` → 422; unknown id → 404; a `PUT` omitting note → stored `null`.
*Honest limit:* the browser half was exercised through the real React tree under jsdom with only
the wire faked. It was **not** clicked through in a real browser via `docker compose up` — the plan
said it would be. Someone should do that before merge, or accept the jsdom-level evidence.

**Refactor pass:** run, no changes made. The new code follows the existing add/delete patterns; the
one real cleanup available (the two forms' duplication) is out of the approved plan's file scope
and is recorded above as a follow-up instead. The plan's "Refactor pass done" checkbox is left
unticked on purpose — editing an approved artifact reopens its gate (stale hash).

**Critic checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Mocks only at boundaries — no asserts on internal collaborators / call-counts. Backend mocks
      nothing at all; the frontend fakes only `fetch`, and asserts the request's *content*.
- [x] Each AC verified per its tag (behavior→interface · invariant→property · non-functional→harness).
      Invariants AC-2/3/4 are asserted as properties (identity preserved; refusal + unchanged row;
      parity with create), not as isolated unit calls.
- [x] Boundary contract asserted richly (args/content), not bare "was called" — the PUT body is
      parsed and its note field asserted; the dismiss test asserts no PUT exists in the call list.
- [x] ≥1 `e2e` AC present and GREEN (reachable through the running system) — AC-9, both halves,
      plus the live-server run above. See the honest limit on the browser.
- [x] Boundaries non-empty ⇒ a smoke AC exists (real boundary, staging) — AC-9; the store boundary
      was hit for real, the browser boundary only at jsdom level.

**Human verdict:** each item confirmed/dismissed (Path R: + SA) — the lane approve stamp records who signed
**Outcome:** clean → merge | divergence → Amendment (.lane/templates/AMENDMENT.md) → re-spec → re-run
