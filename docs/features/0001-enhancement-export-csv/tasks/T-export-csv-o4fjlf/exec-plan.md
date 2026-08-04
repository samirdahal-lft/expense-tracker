---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
# planned_behaviors — machine-read count of RED→GREEN cycles (B-N). Leave empty to let
# lane infer from B-N labels below; SET it when an AC becomes a regression guard so
# `lane next` knows the remaining count (frontmatter edits need no re-approval).
planned_behaviors: "7"
approved_sha256: "fe093f368f479ff83381cd46d25db1cf6b8f0697018e9a811b7390f8b4964c0f"
---
## Exec Plan — Task T-export-csv-o4fjlf
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- `frontend/src/lib/csv.ts` — a pure, DOM-free, clock-free serializer `expensesToCsv(expenses): string`
  (AC-1 header + row order + CRLF, AC-2 canonical fields, AC-3 RFC-4180 quoting, AC-4 empty →
  header only), plus a pure `csvFileName(now: Date): string` returning `expenses-<YYYY-MM-DD>.csv`
  and a thin `downloadCsv(filename, csvText)` that is the single place the browser download
  facility is touched (AC-5).
- `frontend/src/features/expenses/ExportCsvButton.tsx` — presentational control + status region:
  decides nothing-to-export vs. produce-a-file, owns the one status message (AC-5 success,
  AC-6 nothing-to-export, AC-7 replace-not-stack), named button in tab order with a
  `role="status"` live region (AC-9).
- `frontend/src/App.tsx` — one edit: place the control in the expenses section header, fed by the
  already-loaded list (AC-8 read-only: nothing else in the shell changes, no refresh is triggered).
- Tests: `frontend/src/lib/csv.test.ts` (B-1..B-4) and
  `frontend/src/features/expenses/ExportCsv.test.tsx` (B-5..B-8).
- No backend change and no `frontend/src/api/client.ts` change — export issues no request
  (TSD grounding decision).

**Approach:** high-level only — NOT implementation prescription
- Split pure from impure so the file format is provable without a DOM: the serializer and the
  filename builder are total functions of their arguments; the download helper is the only impure
  piece and is passed into the control as an optional prop defaulting to the real one, so
  app-level tests can observe what would have been downloaded.
- Follow the existing layering (`docs/context/BLUEPRINT.md`): pure helper in `lib/` next to
  `format.ts`, presentational component under `features/expenses/`, `App.tsx` as the composition
  root that hands it the list. The control receives data via props — it does not fetch.
- Style with semantic Tailwind tokens only (CONSTITUTION convention 7); reuse the existing button
  class shape from `AddExpenseForm`/`EditExpenseForm` rather than inventing a new visual language.
- The BOM belongs to the download step, not the serializer, so B-1..B-4 assert plain CSV text.
- Status message is a single piece of component state holding one of `null | success | empty`, which
  makes AC-7 (replace, never stack) and AC-5's "never both" structural rather than a test-only
  convention.

**Boundaries & mocks:** (from TSD Boundaries) what's FAKED (network/external services, clock, randomness, filesystem) vs REAL. Each fake = an injected port. Boundaries non-empty ⇒ name the smoke AC that hits the real one in a realistic environment.
- **Browser download facility** (external) — FAKED in B-5..B-7 by injecting a recording
  `downloadCsv` port, so the assertions are about filename + exact bytes rather than about the
  browser. REAL in B-8: the component's default helper runs, with only jsdom's missing
  `URL.createObjectURL`/`revokeObjectURL` stubbed, proving the real path is wired and the object
  URL is revoked. The genuinely-real download is **AC-10, the smoke step** — a human clicking
  Export CSV in `docker compose up` and opening the file in a spreadsheet; recorded in
  verification.md. jsdom cannot download a file, and no automated test in this PR claims to.
- **Clock** (external) — FAKED by fixing system time in B-5 (`csvFileName` is pure and takes the
  date, so the serializer stays deterministic and the filename is assertable). REAL in production.
- **Network** — no new boundary. `fetch` is stubbed in the app-level tests exactly as the existing
  suite does (CONSTITUTION convention 15), to load the list, not to serve the export.
- **Filesystem** — not touched.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 … ; include the `e2e` behavior
- B-1 (tracer bullet) — AC-1: serializer emits the header row plus one CRLF-terminated row per
  expense, in the order given.
- B-2 — AC-2: canonical fields (date `YYYY-MM-DD`, category verbatim, bare integer amount, absent
  note → empty field).
- B-3 — AC-3: RFC-4180 quoting for comma / double quote / line break; other fields unquoted.
- B-4 — AC-4: empty list → header row only.
- B-5 — AC-5: in the app with expenses loaded, activating the control produces exactly one file
  named `expenses-<today>.csv` whose text equals the serializer's output, and shows success.
- B-6 — AC-6: in the app with an empty list, activating produces no file and shows
  nothing-to-export, with no success message.
- B-7 — AC-7: activating twice replaces the status message; the two messages never coexist.
- B-8 (e2e through the running app) — AC-10: with the real download helper in place, activating
  the control drives the actual object-URL + anchor path end to end from the rendered app and
  releases the object URL afterwards. The human browser+spreadsheet confirmation of AC-10 is the
  smoke step in verification.md.

**PR will contain:**
- New: `frontend/src/lib/csv.ts`, `frontend/src/lib/csv.test.ts`,
  `frontend/src/features/expenses/ExportCsvButton.tsx`,
  `frontend/src/features/expenses/ExportCsv.test.tsx`.
- Changed: `frontend/src/App.tsx` (place the control in the expenses section header).
- No backend files, no dependency additions, no config changes.

**Open questions / ambiguities:** (MUST be resolved before execution)
- RESOLVED (TSD): frontend-only generation, no export endpoint.
- RESOLVED (TSD/card): columns are exactly `date,category,amount,note` — `id` and `created_at` are
  not exported.
- RESOLVED (TSD): CRLF row endings and a UTF-8 BOM, for spreadsheet compatibility; the BOM is added
  at the download seam.
- RESOLVED (plan): AC-10's real-browser download is human-verified, not automated — B-8 proves the
  wiring, the smoke step proves the download.
- None outstanding.

**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** ambiguities≥3 · blast-radius≥3 · security · amendments≥2 · prior-fail · self-flag
- None. Ambiguities 0 (all resolved above); blast radius 2 new files + 1 edited file, frontend
  only; no security surface (read-only, no new endpoint, no auth touched, exports only data the
  screen already shows); no amendments; no prior failure. → Path L.
**If overriding R→L:** n/a — no escalation.
- [ ] Refactor pass done (on green; tests unchanged) — before PR
