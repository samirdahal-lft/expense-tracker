---
approved_by: ""
approved_at: ""
# planned_behaviors — machine-read count of RED→GREEN cycles (B-N). Leave empty to let
# lane infer from B-N labels below; SET it when an AC becomes a regression guard so
# `lane next` knows the remaining count (frontmatter edits need no re-approval).
planned_behaviors: ""
---
## Exec Plan — Task <T-ID>
> Authored during planning, before any code. ★GATE where this kind signs the plan — run `lane` and read the step: at `approve-plan` a DEV/SA approves via `lane approve` BEFORE any code (lane writes the stamp). When `lane` says there is no plan gate on this kind, this document is drafted and never signed, and the approved spec is what bounds it. Resolve all ambiguities first either way.

**Will build:** (mapped to each AC)
-
**Approach:** high-level only — NOT implementation prescription
**Boundaries & mocks:** (from the approved spec's Boundaries section) what's FAKED (network/external services, clock, randomness, filesystem) vs REAL. Each fake = an injected port. Boundaries non-empty ⇒ name the smoke AC that hits the real one in a realistic environment.
-
**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 … ; include the `e2e` behavior
-
**PR will contain:**
-
**Open questions / ambiguities:** (MUST be resolved before execution)
-
**Path:** L (lean, default) | R (rich)
**Escalation signals hit (≥2 → R):** ambiguities≥3 · blast-radius≥3 · security · amendments≥2 · prior-fail · self-flag
**If overriding R→L:** risk acknowledged here + SA co-signs Verification.
- [ ] Refactor pass done (on green; tests unchanged) — before PR
