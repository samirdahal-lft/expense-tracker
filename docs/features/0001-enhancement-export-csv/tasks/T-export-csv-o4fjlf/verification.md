## Verification — Task T-export-csv-o4fjlf — 2026-08-04
> Critic anchored to TSD (external spec), NOT to the code. ★GATE: owner confirms/dismisses every flag.
>
> Review method: an independent Critic subagent was given only the frozen `snapshot-TSD.md`, the task
> card, and the task diff — not this narrative and not my reasoning. Its 10 flags are reproduced below
> with what was actually done about each. Two flags were real defects and were fixed test-first
> (B-5, B-6 in the behavior spec); three assertions were strengthened; two tests were added; one flag
> was itself wrong and is recorded as a hallucination.

✅ **Conformant:** items matching spec
- **AC-1/AC-2/AC-3 — the file format.** `expensesToCsv` in [csv.ts](frontend/src/lib/csv.ts) emits
  `date,category,amount,note`, one CRLF-terminated row per expense in the order given, amounts as
  bare integers (no `Rs`, no separator, no decimal), an absent note as an empty field. Asserted by
  exact full-string equality, not substring matching, in [csv.test.ts](frontend/src/lib/csv.test.ts).
- **AC-5 — export with data.** Clicking the control offers exactly one file named
  `expenses-<local YYYY-MM-DD>.csv` whose text equals the serializer's output, and shows a success
  message naming the count and filename. Proven through the real `App` with only the network and the
  browser download boundary stubbed.
- **AC-6 — export with no data.** Empty list ⇒ no file offered at all and the message
  "Nothing to export — add an expense first."; the success message is asserted absent.
- **AC-7 — repeat activation.** One `role="status"` region carrying exactly one message; messages
  never stack. Structural: a single `Status` union in state, not appended nodes.
- **AC-8 — read-only.** The app-level tests record every `fetch` call and assert the export issues
  **no request at all** (stronger than "no writes"), and that the expenses panel's rendered HTML is
  byte-identical before and after, ignoring the status line. Structurally reinforced: the export path
  imports nothing from `api/client.ts`.
- **AC-9 — accessibility.** The control is located by accessible role + name (an unnamed or
  non-`button` control fails the tests), is a native `<button>` with no `tabindex`, takes focus, and
  exports when activated while focused. The outcome is conveyed by a live region, not colour.
- **Boundaries honoured.** The only impure code is `downloadCsv` (Blob + object URL + anchor click)
  and one `new Date()` read in the control. `expensesToCsv` and `csvFileName` are pure and are
  asserted directly, with no DOM and no fake clock.
- **Layering.** No backend change, no new API surface, no new dependency — as the TSD decided.

⚠️ **Divergent:** deviation + severity (shallow/deep)
- **(shallow) Test-side deviation from the approved exec plan.** The plan says "the download helper
  is the only impure piece and is passed into the control as an optional prop defaulting to the real
  one". That prop exists and is honoured in production code. But the *app-level* tests do not use it
  — reaching it through `App` would require threading a test-only prop through the composition root,
  so those tests instead stub the browser boundary itself (`URL.createObjectURL` +
  `HTMLAnchorElement.prototype.click`), exactly the way `fetch` is stubbed. I edited the approved plan
  to describe this, which correctly reopened the approve-plan gate; I reverted the edit to the
  byte-identical approved text and am disclosing the deviation here instead. **Owner's call:** accept
  as written, or require an amendment.
  *Effect on coverage:* none — the injected port is now covered by its own focused test
  ("the injectable download seam"), and the browser seam is covered by B-7.
- **(shallow) Ledger shape is thinner than planned.** The plan listed 8 behaviors; only 4 earned a
  test-first RED→GREEN. Cause, stated plainly: B-4 was the first behavior needing the whole vertical,
  and the smallest implementation that turned it green already contained the empty-list branch, the
  single-message state, and the blob details — so plan B-4 and B-6..B-8 passed on arrival and
  `lane red` rightly refused to record a RED for them. They are committed via `lane red --backfill`
  and counted apart. A stricter B-4 (export unconditionally, leave the empty branch to its own cycle)
  would have kept them on the ledger. Recorded in
  [behavior-spec.md](docs/features/0001-enhancement-export-csv/tasks/T-export-csv-o4fjlf/behavior-spec.md).
- **(shallow) An earlier note in that spec estimated 7 ledger cycles.** That estimate was wrong and
  is now corrected in place rather than quietly deleted. Real count: 4 planned + 2 review-driven.

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- **Critic flag 9 — "the card's AC numbering is off by one relative to the PRD".** Checked against
  both documents: it is not. The Critic appears to have aligned the card's 10 ACs against the PRD's 8
  and read the offset as an error. Dismissed as a false positive; no change made.

❌ **Missing:** acceptance criteria not addressed
- **AC-10 smoke — still outstanding, and it cannot be closed from here.** jsdom implements neither
  object URLs nor real downloads, so no automated test can prove a file lands on disk. The wiring
  either side of that gap *is* proven (a `text/csv;charset=utf-8` blob carrying the UTF-8 BOM
  `EF BB BF`, the anchor's `download` filename, exactly one `revokeObjectURL`). The human step:
  with `docker compose up`, open `http://localhost:8090`, click **Export CSV**, and confirm
  (a) a file named `expenses-2026-08-04.csv` downloads, (b) it opens in a spreadsheet with four
  columns, (c) a note containing a comma stays in one cell, (d) the amount reads as a plain number;
  then delete every expense and confirm the empty case shows the message and downloads nothing.

**Critic flags and their resolutions (all 10):**
| # | Flag | Severity | Resolution |
|---|------|----------|------------|
| 1 | Success message recomputed `expenses.length` from live props, so deleting a row silently rewrote a past export's message ("Exported 1 expense" after a 2-expense export) | **HIGH — real bug** | Reproduced with a failing test, checkpointed as **B-5 RED**, fixed by capturing `count` in `Status` at export time, **B-5 GREEN** |
| 2 | Filename test used `new Date("...Z")` (UTC) while the assertion is on the *local* calendar day — fails outside a band of timezones | real fragility, verified failing under `TZ=Pacific/Auckland` | Changed to local construction `new Date(2026, 7, 4, 12, 0, 0)`; suite re-run under `TZ=Pacific/Auckland`, 32/32 pass |
| 3 | `csvFileName` had no unit test of its own — zero-padding was only implied | test gap | Added a guard asserting `2026-01-09` and `2026-12-31` padding, back-filled |
| 4 | `quoteField` was applied only to `note`; a comma arriving in any other field would silently produce a 5-column row | **real correctness gap** | **B-6 RED** with a hostile date/category, then GREEN applying `.map(quoteField)` to every field |
| 5 | B-4's blob assertion used `toContain` on the CSV text — could pass for the wrong reason | weak assertion | Kept `toContain` for the BOM-prefixed blob (correct there), and added exact-equality assertions at the serializer and injected-port level |
| 6 | The injectable `downloadCsv` prop was dead — nothing exercised it | dead seam | Added a focused test handing in a recording port and asserting both the filename and the exact CSV text |
| 7 | AC-5's "message replaced" check never exercised an *outcome change* (success → nothing-to-export) | weak assertion | Added the AC-5 guard: export, delete the last expense, export again, assert the message flips and does not stack |
| 8 | AC-8 asserted "no writes" but not "no refetch", and did not check the panel was unchanged | weak assertion | Strengthened to assert the total call count is unchanged and the `main` HTML is identical modulo the status line |
| 9 | Card AC numbering off by one vs the PRD | — | **Dismissed — hallucination.** Verified against both documents; numbering is consistent |
| 10 | No test proved the control is keyboard-reachable | test gap | Added the AC-8 guard: native `BUTTON`, no `tabindex`, takes focus, exports when activated while focused |

**TDD cycle log:**
| Behavior | RED ✅ | GREEN ✅ | Test = behavior not impl | Public interface only | Mocks @ boundary only |
|----------|--------|---------|--------------------------|----------------------|----------------------|
| B-1: header + one CRLF row per expense (`13f6652` → `a964fc9`) | ✅ | ✅ | ✅ asserts the file's exact bytes | ✅ `expensesToCsv` | ✅ none needed (pure) |
| B-2: canonical fields, absent note ⇒ empty field (`9bc681f` → `7e88a64`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| B-3: RFC 4180 quoting of notes (`e3c450b` → `03b2d47`) | ✅ | ✅ | ✅ incl. the unquoted case | ✅ | ✅ |
| B-4: export from the running app (`6fc073f`/`8530dcf`/`6970340` → `0065139`) | ✅ (re-anchored twice — see note) | ✅ | ✅ asserts the offered file + the user-visible message | ✅ via `App` and role/name queries | ✅ `fetch` + the browser download boundary only |
| B-5: status message stays faithful to the export that produced it (`c0881c2` → `7865eea`) | ✅ | ✅ | ✅ review-driven, reproduced the bug first | ✅ | ✅ |
| B-6: quoting applies to every field (`795286e` → `aedceed`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| *Off-ledger back-fills* (`645ac07`, `ee8c134`, `c216b76`, `02f133c`, `c91b4ca`) | n/a | n/a | ✅ | ✅ | ✅ | 

> **B-4 re-anchoring, disclosed.** B-4's RED was checkpointed three times before its GREEN. Each
> re-anchor was a defect in *my test*, not a moved goalpost: (1) a stubbed `CategorySummary` rendered
> a second `<ul>`, making the `list` query ambiguous; (2) jsdom's `Blob` has no `text()`, so the
> assertion threw rather than failed; (3) `readAsText` decodes UTF-8 and swallows the BOM, so the BOM
> had to be read as raw bytes. The behavior under test never changed.
>
> **Back-fills, itemised.** AC-4 (empty list ⇒ header row alone), AC-6 (empty list ⇒ no file +
> message), AC-7 (repeat activation), AC-10 wiring (`text/csv` + BOM + revoke), and the post-review
> guards for AC-5/AC-6/AC-8/`csvFileName`/the injected port. Every one passed on first run, so none
> could honestly be a RED; each is committed with `lane red --backfill` and audited, not disguised.

**Critic checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Mocks only at boundaries — no asserts on internal collaborators / call-counts. Two boundaries
      are stubbed: `fetch` and the browser download (object URL + anchor click). No internal function
      is mocked; the call-count assertion that exists is on the *network boundary* (AC-8's "no
      request at all"), which is a contract, not an implementation detail.
- [x] Each AC verified per its tag. behavior ACs (1,2,3,4,5,6,7) → asserted through public
      interfaces; invariant AC-8 → asserted as a property of the app-level tests plus a structural
      import argument; non-functional AC-9 → role/name queries and a focus/activation test.
- [x] Boundary contract asserted richly. The download boundary is asserted on filename, exact CSV
      text, MIME type, the three BOM bytes, and exactly one `revokeObjectURL` — never a bare
      "was called".
- [x] ≥1 `e2e` AC present and GREEN. AC-5/AC-6/AC-7 run through the real `App` composition root;
      B-7 asserts the real `downloadCsv` seam. **Caveat:** "e2e" here means the whole frontend
      vertical in jsdom, not a browser. AC-10 is the browser-level step and is listed under Missing.
- [x] Boundaries non-empty ⇒ a smoke AC exists. AC-10 is that smoke AC. It is **not yet run** — it
      needs a human at a browser, and it is the one open item below.

**Suite state at hand-off:** `TYPECHECK OK`; `Test Files 10 passed (10)`, `Tests 33 passed (33)` —
re-run under `TZ=Pacific/Auckland` as well as the local zone.

**Human verdict:** each item confirmed/dismissed (Path R: + SA) — the lane approve stamp records who signed
- Two items genuinely need the owner: the **shallow test-side deviation** from the plan's injected-port
  wording (accept, or require an amendment), and the **AC-10 smoke run**, which no agent can perform.
**Outcome:** clean → merge | divergence → Amendment (.lane/templates/AMENDMENT.md) → re-spec → re-run
