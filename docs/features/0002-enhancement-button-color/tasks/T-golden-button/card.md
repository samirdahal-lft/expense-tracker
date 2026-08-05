---
approved_by: "Samir dahal"
approved_at: "2026-08-05"
approved_sha256: "a6cdcfaab0bbcf48bb8eab5f7744156ab1bb250eb55c3a3051378240eec726f7"
---
## Task T-golden-button — The Export CSV button renders as a filled red control

> **The task ID says "golden"; the colour is red.** The card was scaffolded two respecs ago and the ID
> is baked into the branch, the registry and the ledger trailers, so renaming it would cost more than
> the misleading word does. Read the ID as "the button-colour task".
**Parent:** story S-0002.01 · feature 0002-enhancement-button-color (docs/features/0002-enhancement-button-color/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)

One control, one visual property, one file. The whole slice is presentational: the export control
already exists and works (feature 0001), so this task changes what it looks like and nothing else.

**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: The export control renders as a **filled deep-red** button — a `red-700`
      background with a **white** label (6.47:1) — instead of today's outline treatment (a border
      over a transparent background). The pairing is fixed: no red shade takes both a white and a
      dark label at AA, so a dark label on this fill is a defect (TSD Grounding).
- [ ] AC-2 [behavior]: The control declares a **deeper red** hover fill (`red-800`, 8.31:1 against
      the same label), so hover feedback survives the loss of the outline button's `hover:bg-secondary`.
- [ ] AC-3 [invariant]: The control declares its own **visible focus indicator**, distinct from the
      fill, so 0001's AC-9 (keyboard-reachable, state perceivable) does not regress.
- [ ] AC-4 [invariant]: **One** shade set for both themes — no theme-conditional fill. The earlier
      purple attempt's `dark:` variant is exactly what measured below 4.5:1.
- [ ] AC-5 [invariant]: The fill does **not** use the destructive token or its shade — no
      `bg-destructive`, and not `red-600`, which measures as `--destructive` (`#dc2626` vs `#dc2828`).
      Red is this app's delete-and-error signal; a read-only export must not wear the same red
      (PRD AC-8).
- [ ] AC-6 [invariant]: Export behavior untouched — same accessible role and name, same CSV text,
      same success and nothing-to-export messages. **0001's existing tests pass unchanged and are
      not edited**; they locate the control by role and name, never by class.
- [ ] AC-7 [e2e]: In the running app (`docker compose up`, `http://localhost:8090`) the owner sees a
      red Export CSV button, hover deepens it, tabbing to it shows a focus indicator, and clicking
      it still downloads the CSV — checked in both light and dark theme, and with a delete control
      and a form error on screen, confirming the export still reads as safe to click.

**End-to-end AC:** AC-7 [e2e] — reachable through the running app (required: green component/unit ≠ reachable)

> **AC-7 is human-only and cannot be automated here.** Whether a fill *reads as red* rather than salmon
> or maroon — and whether it reads as *destructive* — is only observable to an eye on a real screen;
> jsdom has no layout or paint. AC-1..AC-5 are provable at the unit level only as "which
> fill/foreground/hover/focus classes were declared, and which were not" — the contrast ratios
> themselves are fixed in the TSD by measurement, not asserted at runtime. Do not expect the ledger to
> prove the colour looks right, and do not expect AC-5 to prove the two reds look different: it proves
> only that the destructive shade was not the one used.

**Tests:** AC-1, AC-2, AC-3, AC-4, AC-5  ← ordered; first = tracer bullet
**Test scope:** frontend/src/features/expenses/ExportCsv.test.tsx   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.

> **Note on test location.** This task adds to the file 0001's component tests already live in,
> rather than creating `tests/T-golden-button/`. Appending is allowed; the existing test cases in
> that file are proven and must not be rewritten (see the ledger guard).

<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
