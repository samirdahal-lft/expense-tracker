---
approved_by: "Samir dahal"
approved_at: "2026-08-20"
approved_sha256: "25c20bbd97cd981ac044a8f424324efddb632a3565ae483371e0f47323bc40e6"
---
## Exec Plan — Task T-change-bg-color-tlouek
> Derived verbatim from this patch's approved SPEC.md (`## Execution Plan` section) —
> the human's ONE spec stamp covers this plan (two-stamp ceremony, patch kind). Editing
> this file reopens its gate like any stamped artifact (stale hash → re-approve).

## Execution Plan

**Approach:** Edit the two `--background` values in `frontend/src/index.css`. Write a test that reads the file and asserts the exact HSL strings for both light and dark modes.
**Boundaries & mocks:** None — the test reads the real file on disk.
**Behaviors (TDD order):**
- B-1: Test asserts `--background: 30 20% 97%` in `:root` and `--background: 220 13% 10%` in `.dark` — fails before the edit; passes after updating `index.css`.
**Open questions:** none
