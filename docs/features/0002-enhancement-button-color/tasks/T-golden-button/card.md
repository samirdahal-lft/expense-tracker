---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "49296caba6736a0b7a8ddb983bef7e051eebf9d863ed0f9856e909c413700c38"
---
## Task T-golden-button — The Export CSV button renders as a filled pink control

> **The task ID says "golden"; the colour is pink.** The card was scaffolded under the previous
> respec and the ID is baked into the branch, the registry and the ledger trailers, so renaming it
> would cost more than the misleading word does. Read the ID as "the button-colour task".
**Parent:** story S-0002.01 · feature 0002-enhancement-button-color (docs/features/0002-enhancement-button-color/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)

One control, one visual property, one file. The whole slice is presentational: the export control
already exists and works (feature 0001), so this task changes what it looks like and nothing else.

**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: The export control renders as a **filled soft-pink** button — a `pink-400`
      background with a **near-black** label (7.48:1) — instead of today's outline treatment (a border
      over a transparent background). The pairing is fixed: no pink shade takes both a white and a
      dark label at AA, so a light label on this fill is a defect (TSD Grounding).
- [ ] AC-2 [behavior]: The control declares a **deeper pink** hover fill (`pink-500`, 5.61:1 against
      the same label), so hover feedback survives the loss of the outline button's `hover:bg-secondary`.
- [ ] AC-3 [invariant]: The control declares its own **visible focus indicator**, distinct from the
      fill, so 0001's AC-9 (keyboard-reachable, state perceivable) does not regress.
- [ ] AC-4 [invariant]: **One** shade set for both themes — no theme-conditional fill. The earlier
      purple attempt's `dark:` variant is exactly what measured below 4.5:1.
- [ ] AC-5 [invariant]: Export behavior untouched — same accessible role and name, same CSV text,
      same success and nothing-to-export messages. **0001's existing tests pass unchanged and are
      not edited**; they locate the control by role and name, never by class.
- [ ] AC-6 [e2e]: In the running app (`docker compose up`, `http://localhost:8090`) the owner sees a
      pink Export CSV button, hover deepens it, tabbing to it shows a focus indicator, and clicking
      it still downloads the CSV — checked in both light and dark theme.

**End-to-end AC:** AC-6 [e2e] — reachable through the running app (required: green component/unit ≠ reachable)

> **AC-6 is human-only and cannot be automated here.** Whether a fill *reads as pink* rather than red
> or magenta is only observable to an eye on a real screen; jsdom has no layout or paint. AC-1..AC-4
> are provable at the unit level only as "which fill/foreground/hover/focus classes were declared" —
> the contrast ratios themselves are fixed in the TSD by measurement, not asserted at runtime. Do not
> expect the ledger to prove the colour looks right.

**Tests:** AC-1, AC-2, AC-3, AC-4  ← ordered; first = tracer bullet
**Test scope:** frontend/src/features/expenses/ExportCsv.test.tsx   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.

> **Note on test location.** This task adds to the file 0001's component tests already live in,
> rather than creating `tests/T-golden-button/`. Appending is allowed; the existing test cases in
> that file are proven and must not be rewritten (see the ledger guard).

<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
