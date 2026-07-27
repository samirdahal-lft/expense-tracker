---
approved_by: "Samir dahal"
approved_at: "2026-07-27"
approved_sha256: "aa06f1b357f5d6368f45347af008d0eb889ff438b933128887b148498709916c"
---
## Task T-edit-bf02tp — Correct a recorded expense (edit amount, category, date, note)
**Parent:** story S-0002.01 · feature 0002-enhancement-edit (docs/features/0002-enhancement-edit/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)
Update path for one existing expense, end to end: the update-by-id API contract, the typed
client call, the seeded edit form on a listed row, and the live list + summary refresh after a
save. Split backend-only and frontend-only would each be a horizontal slice with no AC a user
can observe, so this story ships as one card.
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: Submitting valid new values for an existing expense persists them — a subsequent read of the expense returns exactly the submitted amount, category, date, and note.
- [ ] AC-2 [invariant]: The expense keeps its identity across an update — its `id` and its original `created_at` are unchanged, and no expense is added or removed.
- [ ] AC-3 [invariant]: An amount that is zero, negative, or non-integer is refused with a client error naming the offending field, and the stored expense is left unchanged. The refusal holds at the API, not only in the browser.
- [ ] AC-4 [invariant]: A category outside the fixed set, and a malformed or non-calendar date, are refused on the same terms as at creation — editing is not a validation bypass.
- [ ] AC-5 [behavior]: Updating an unknown expense id is reported as not-found and mutates nothing.
- [ ] AC-6 [behavior]: Opening edit on a listed expense presents a form pre-filled with that expense's current amount, category, date, and note; an absent note presents as an empty field.
- [ ] AC-7 [behavior]: Submitting the form empties the note when the note field is submitted empty — the note is a replaced field, not a preserved one.
- [ ] AC-8 [behavior]: Dismissing the edit form without submitting mutates nothing and issues no update request.
- [ ] AC-9 [e2e]: In the running app, a user viewing the expense list opens an entry, changes its amount and category, saves, and sees the updated row and the re-reflected per-category summary without reloading the page.
**End-to-end AC:** AC-9 [e2e] — reachable through the running app (required: green component/unit ≠ reachable)
**Tests:** AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9  ← ordered; first = tracer bullet
**Test scope:** backend/tests/ (API + service) · frontend/src/features/expenses/*.test.tsx (form + list)   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
