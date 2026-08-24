---
approved_by: "Samir dahal"
approved_at: "2026-08-24"
approved_sha256: "e719953d1c7b4715bec23c3d51c0009a2091ad82b96b82e69ae252bccd579d21"
---
## Exec Plan — Task T-make-button-pink-l14gsl
> Derived verbatim from this patch's approved SPEC.md (`## Execution Plan` section) —
> the human's ONE spec stamp covers this plan (two-stamp ceremony, patch kind). Editing
> this file reopens its gate like any stamped artifact (stale hash → re-approve).

## Execution Plan

**Approach:** Update the two `--primary` (and `--ring`) entries in `frontend/src/index.css` from the current green hue to a pink hue. Write a JSDOM test that loads the stylesheet and asserts the CSS variable value.
**Boundaries & mocks:** None — pure CSS change, test reads computed style via JSDOM.
**Behaviors (TDD order):**
- B-1: Test asserts `--primary` in `:root` and `.dark` contains hue 330 (pink) — fails on green, passes after edit
**Open questions:** none
