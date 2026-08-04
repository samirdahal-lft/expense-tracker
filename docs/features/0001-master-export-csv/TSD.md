---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "64fe38f969f76a540fad1c4d95d0db3c95e39d9db0ae0a9062367b43e05d2d49"
---
# TSD 0001 — Export expenses to CSV
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.
> Story IDs are S-0001.nn — the 0001 prefix is what resolves this folder (docs/features/0001-*/),
> so the `## TSD S-0001.nn` header below must match the story ID exactly.

## TSD S-0001.01 — Export all expenses to a CSV file  (PRD §S-0001.01)
| Aspect | Spec |
|--------|------|
| Interfaces | An export request/response pair reachable at `GET /api/expenses/export`: on success, a CSV document (one row per stored expense, columns `id, amount, category, date, note, created_at`); on the empty case, a non-2xx failure response distinguishable from success. A frontend trigger ("Export CSV") that issues this request and, on success, hands the browser a downloadable `.csv` file. |
| Data / State | Read-only — reads every row of the existing expenses store (see BLUEPRINT.md Containers: SQLite). No new persistent state, no schema change, no writes. |
| Behavior | See PRD §S-0001.01 AC-1..AC-5: non-empty store → CSV with every expense present exactly once, `amount` as a whole integer, `date` as `YYYY-MM-DD`; empty store → no CSV produced, failure signaled distinctly from success. Frontend: non-empty → file downloads + success message shown; empty → no file downloads + failure message shown explaining there is nothing to export. |
| Access | Same as every other endpoint in this app today — no authentication/authorization exists (PRODUCT.md: single-user, no auth). Any client that can reach `/api` can invoke this. |
| Boundaries | The browser's native file-download mechanism — this app does not control how the OS/browser presents or saves the downloaded file, only that it triggers a download of the correct bytes with a `.csv`-appropriate content type. |
| Tests | unit: CSV row/column construction from a set of expenses (ordering, integer amount, date format, note null-handling); empty-store detection maps to the failure path. integration: `GET /api/expenses/export` returns the full, correctly-shaped CSV for a populated store and a distinguishable failure response for an empty store. smoke (required — Boundaries non-empty): a real browser interaction confirms clicking "Export CSV" produces an actual downloaded file for a non-empty store and shows the failure message with no download for an empty store. |
