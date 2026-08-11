---
approved_by: "Samir dahal"
approved_at: "2026-08-11"
approved_sha256: "096a7f14da9cd432f32f72cfc2ff273311b93498d1bcc493729efbf83d3ab793"
---
# Patch 0005 — Change app background color to golden
> A `patch` iteration — the TWO-STAMP ceremony for small, known-scope work (a bug fix, a
> tweak, one behavior, one PR). This ONE document is the ticket + TSD + task card + exec
> plan: your single `lane approve` stamp covers all of it (stamp 1 of 2; stamp 2 is the
> verification report at the end). The TDD ledger, Critic snapshot, and verify replay are
> unchanged — a patch removes redundant signatures, never proof.
> Too big for a patch? More than one story, more than ~3 behaviors, or more than one task
> → use `lane new fix` / `lane new enhancement` instead (agents: CALL THIS OUT when
> drafting; the human decides at the stamp).

**Severity:** minor
**Source:** design request — user preference for a warmer golden background tone

**Current behavior:** The app background uses a cool blue-tinted neutral (`--background: 210 40% 98%` in light mode, `222 47% 8%` in dark mode), giving the UI a cold feel.
**Expected behavior:** The app background uses a warm golden hue (`--background: 43 80% 90%` in light mode, `43 35% 14%` in dark mode) in both themes.
**Must NOT change:** All other CSS custom properties (primary, secondary, card, foreground, border, ring, etc.) remain untouched. Theme toggle behavior is unaffected.

## TSD S-0005.01 — Golden background CSS variable
> Behavior + contracts ONLY — never the library/method/pattern. The Critic anchors to THIS
> section (snapshot frozen at `lane start`), exactly as it would to a TSD.md section.

| Aspect | Spec |
|--------|------|
| Interfaces | `--background` CSS custom property in `frontend/src/index.css`, inside `:root` (light) and `.dark` selectors |
| Data / State | No runtime state — pure static CSS variable change |
| Behavior | Light mode: `--background` resolves to `43 80% 90%` (golden hue, high lightness). Dark mode: `--background` resolves to `43 35% 14%` (golden hue, low lightness). All other variables unchanged. |
| Boundaries | None — no external deps |
| Tests | Read `frontend/src/index.css`; assert `--background` under `:root` equals `43 80% 90%` and under `.dark` equals `43 35% 14%` |

## Task T-background-color-hjwfyk — Update --background to golden in both themes
**Slice:** a complete observable behavior end-to-end + tests (full vertical)
**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
- [ ] AC-1 [behavior]: `--background` in `:root` is `43 80% 90%`
- [ ] AC-2 [behavior]: `--background` in `.dark` is `43 35% 14%`
**Tests:** AC-1, AC-2

## Execution Plan
> Approved BY the spec stamp: `lane start` copies this section verbatim into the worktree's
> exec-plan.md and carries your stamp onto it — no separate plan gate. Keep it last in this file.

**Approach:** Edit the two `--background` HSL values in `frontend/src/index.css` — one in `:root`, one in `.dark`. No component or Tailwind config changes needed.
**Boundaries & mocks:** None — test reads the CSS file directly via Node `fs`; no browser or bundler required.
**Behaviors (TDD order):**
- B-1: Write a test that reads `index.css` and asserts `--background` in `:root` is `43 80% 90%` and in `.dark` is `43 35% 14%`. Commit as RED. Then update both values in `index.css`. Commit as GREEN.
**Open questions:** none

## TSD S-0005.01 — Golden background CSS variable
> Behavior + contracts ONLY — never the library/method/pattern. The Critic anchors to THIS
> section (snapshot frozen at `lane start`), exactly as it would to a TSD.md section.

| Aspect | Spec |
|--------|------|
| Interfaces | `--background` CSS custom property in `frontend/src/index.css`, inside `:root` (light) and `.dark` selectors |
| Data / State | No runtime state — pure static CSS variable change |
| Behavior | Light mode: `--background` resolves to `43 80% 90%` (golden hue, high lightness). Dark mode: `--background` resolves to `43 35% 14%` (golden hue, low lightness). All other variables unchanged. |
| Boundaries | None — no external deps |
| Tests | Read `frontend/src/index.css`; assert `--background` under `:root` equals `43 80% 90%` and under `.dark` equals `43 35% 14%` |
