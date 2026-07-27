---
approved_by: "Samir dahal"
approved_at: "2026-07-27"
# planned_behaviors — machine-read count of RED→GREEN cycles (B-N). Leave empty to let
# lane infer from B-N labels below; SET it when an AC becomes a regression guard so
# `lane next` knows the remaining count (frontmatter edits need no re-approval).
planned_behaviors: "8"
approved_sha256: "7ca91ea51f401764a2513bea093c382781cef4072e67bb9d2a785fb567ff61d0"
---
## Exec Plan — Task T-edit-bf02tp
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- An update-expense-by-id endpoint on the existing API, taking the same four editable fields
  the create endpoint takes and returning the complete updated resource — AC-1
- Preservation of server-owned identity across that update: `id` and `created_at` are never
  written, and the row count is unchanged — AC-2
- Refusal, at the API, of every input the create endpoint already refuses — non-positive or
  non-integer amount, category outside the fixed set, malformed or non-calendar date — with
  the offending field named and the stored row untouched — AC-3, AC-4
- A not-found outcome for an unknown id, mutating nothing — AC-5
- An edit affordance on each listed expense that opens a form seeded with that expense's
  current amount, category, date and note (absent note → empty field) — AC-6
- Full-replacement save semantics for the note: submitting the note field empty clears the
  stored note rather than preserving the old one — AC-7
- A dismiss affordance that closes the form without issuing an update request — AC-8
- Live refresh of both the expense list and the per-category summary after a successful save,
  with no page reload — AC-9

**Approach:** high-level only — NOT implementation prescription
- Backend follows the existing `router → service → repository → SQLite` flow (CONSTITUTION §1,
  BLUEPRINT boundary rules). The update is a read-modify-write of exactly one row, matched by
  `id`, issued from the repository layer only; the router stays thin and the service owns the
  not-found decision. No new architectural layer, no SQL outside the repository.
- The request body is a Pydantic model at the API boundary (CONSTITUTION §3, hard rule). It
  derives its rules from the create model rather than restating them, so "editing is not a
  validation bypass" (AC-4) holds by construction — there is one validation definition, not two
  that can drift. Amount stays an integer number of whole NPR at every boundary.
- The endpoint is a full replacement of the four editable fields (TSD: "not a partial patch"),
  so it is a PUT on the expense's own URL, mirroring the existing DELETE-by-id route shape.
- Frontend adds one function to the existing typed API client (`src/api/client.ts`) — no raw
  fetch in components (CONSTITUTION §4). The list gains an edit control that hands the chosen
  expense up; the app shell owns "which expense is being edited" and renders a seeded edit form
  beside the existing add form. On a successful save it reuses the shell's existing
  refresh-list-and-summary path, the same one create and delete already use.
- Styling stays on Tailwind utility classes, matching the existing add form and list rows.

**Boundaries & mocks:** (from TSD Boundaries) what's FAKED (network/external services, clock, randomness, filesystem) vs REAL. Each fake = an injected port. Boundaries non-empty ⇒ name the smoke AC that hits the real one in a realistic environment.
- **Persistent store — REAL in every backend test.** The existing root `conftest.py` injects a
  per-test temp SQLite file via `EXPENSE_DB_PATH` and runs the real schema, so backend tests
  exercise real SQL through the real repository. Nothing about the store is mocked, and no
  internal collaborator (repository, service) is stubbed — the tests go in through the HTTP
  interface via `TestClient`.
- **Clock — not a dependency, and that is asserted.** `created_at` is preserved, never
  restamped, so the update path takes no clock at all. B-1 asserts the original `created_at`
  survives, which is what makes the absence of a clock observable rather than assumed.
- **Network — FAKED in frontend tests only.** The injected port is the browser `fetch` the typed
  API client sits on; vitest stubs it with a small stateful store, the pattern already used by
  `DeleteExpense.test.tsx`. The React component tree, the hooks and the API client itself are
  all real — only the wire is faked.
- **Smoke AC hitting the real boundary: AC-9**, split so both halves are genuinely proven.
  B-4 drives the real SQLite store through the real HTTP API and asserts an update that moves an
  amount between categories reconciles in the summary endpoint. B-8 drives the real component
  tree and asserts the list row and the summary both re-reflect the change with no reload.
  Before the PR, the change is also exercised by hand in the running app (`docker compose up`)
  against the real store — a green component test is not the same as reachable.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 … ; include the `e2e` behavior
- **B-1** [AC-1, AC-2] *tracer bullet, backend* — updating an existing expense with valid new
  values persists exactly those values; a subsequent read returns them, with `id` and the
  original `created_at` unchanged and the expense count unchanged.
- **B-2** [AC-3, AC-4] *backend* — the update endpoint refuses precisely what the create endpoint
  refuses (amount zero, negative, non-integer; category outside the fixed set; malformed and
  non-calendar dates), names the offending field, and leaves the stored row unchanged. One cycle,
  not two: the point of the behavior is validation *parity*, and it is satisfied by a single
  change — deriving the update model's rules from the create model's.
- **B-3** [AC-5] *backend* — updating an unknown id is reported as not-found and mutates nothing.
- **B-4** [AC-9, store half] *backend* — an update that moves an amount from one category to
  another reconciles in the summary endpoint, against the real store.
- **B-5** [AC-6] *frontend* — opening edit on a listed expense presents a form pre-filled with
  that expense's current amount, category, date and note; an absent note presents as an empty
  field. Builds the list's edit control, the shell's editing state and the seeded form — not yet
  its submit or dismiss handlers.
- **B-6** [AC-7] *frontend* — saving the form with the note field emptied clears the note on that
  expense: the note is a replaced field, not a preserved one. Builds the client's update call and
  the save path, refreshing the list.
- **B-7** [AC-8] *frontend* — dismissing the form without submitting issues no update request and
  leaves the listed expense unchanged.
- **B-8** [AC-9, e2e] *frontend* — through the running app: a user opens a listed entry, changes
  its amount and category, saves, and sees both the updated row and the re-reflected per-category
  summary without reloading the page. Extends the save path from refreshing the list to
  refreshing the summary too.
- *Sequencing note, stated openly:* B-6 deliberately refreshes only the list, and B-8 extends
  that to the summary. Each GREEN builds only what its own behavior needs, so B-8's RED fails for
  a real reason instead of passing on work smuggled in earlier. This is the minimality rule, not
  an oversight.

**PR will contain:**
- `backend/app/models/expense.py` — the update request model, deriving its rules from the create model
- `backend/app/repositories/expenses.py` — a single-row update, returning the updated row or nothing
- `backend/app/services/expenses.py` — the update operation and the not-found decision
- `backend/app/routers/expenses.py` — the update-by-id route, thin
- `backend/tests/test_expenses_update.py` — B-1 … B-4
- `frontend/src/api/client.ts` — the typed update call
- `frontend/src/features/expenses/EditExpenseForm.tsx` — the seeded edit form (new)
- `frontend/src/features/expenses/ExpenseList.tsx` — the per-row edit control
- `frontend/src/App.tsx` — editing state, save/dismiss wiring, refresh on save
- `frontend/src/features/expenses/EditExpense.test.tsx` — B-5 … B-8
- `docs/features/0002-enhancement-edit/tasks/T-edit-bf02tp/` — behavior spec, verification report

**Open questions / ambiguities:** (MUST be resolved before execution)
- *How is "an emptied note" represented?* **Resolved:** an empty or whitespace-only note means
  "no note" and is stored as absent — the same normalization the add form already applies at
  create. This keeps one representation of "no note" across create and update, and it is what
  makes AC-6 and AC-7 consistent with each other: a cleared note is an absent note, and an absent
  note seeds an empty field. AC-1's "exactly the submitted note" is proven with a real non-empty
  note, so the two ACs do not collide.
- *Which HTTP method?* **Resolved:** PUT. The TSD calls the body a full replacement of the four
  editable fields, explicitly "not a partial patch".
- *What does "a client error naming the offending field" look like?* **Resolved:** the framework's
  existing validation-error response, which already identifies the offending field, exactly as the
  create endpoint returns today. The CONSTITUTION lists the error-envelope shape as an open
  question for the project; this task does not invent an answer, it stays consistent with create.
- *How far does the e2e AC reach?* **Resolved:** split into B-4 (real store and summary through
  the real API) and B-8 (real component tree, no reload), plus a manual pass in the running app
  before the PR. Neither half alone would honour "reachable through the running app".

**Path:** L (lean, default) | R (rich)
→ **L.** Signals hit: blast-radius (backend and frontend, one new component) — 1 signal. No
security surface (single local user, no auth), no amendments, no prior failure, no self-flag, and
the ambiguities above are resolved in this plan rather than carried into execution. 1 signal < 2.
**Escalation signals hit (≥2 → R):** ambiguities≥3 · blast-radius≥3 · security · amendments≥2 · prior-fail · self-flag
**If overriding R→L:** risk acknowledged here + SA co-signs Verification.
- [ ] Refactor pass done (on green; tests unchanged) — before PR
