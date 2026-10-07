---
approved_by: ""
approved_at: ""
---
# Spec <FEAT> — <short title>
> The COMBINED document, for small, known-scope work (a bug fix, a tweak, one behavior, one
> PR). This ONE file is the ticket + technical spec + task card + exec plan: a single
> `lane approve` stamp covers all of it, and this kind's one task is created with it. The TDD
> ledger, Critic snapshot, and verify replay are unchanged — a combined document removes
> redundant signatures, never proof. `lane` prints where this stamp sits in the kind's ceremony
> and what the remaining ones are.
> Outgrown one document? More than one story, more than ~3 behaviors, or more than one task —
> call it out when you hand the gate over; the human decides at the stamp. Where this kind is
> on the promote ladder (`lane kinds` shows its rung), `lane promote <FEAT> <kind>` carries
> this document into the heavier one with nothing retyped.

**Severity:** <blocker | major | minor>
**Source:** <where this came from — bug report, monitoring, review feedback>   ← audit chain

**Current behavior:** <what happens now — the scenario that triggers it, not just the error message>
**Expected behavior:** <what should happen instead>
**Must NOT change:** <behavior/contracts that stay intact — guards against regression>

## TSD S-<FEAT>.01 — <title>
> Behavior + contracts ONLY — never the library/method/pattern. The Critic anchors to THIS
> section (snapshot frozen at `lane start`), exactly as it would in a standalone technical
> document. The `## TSD <story-id>` heading is the marker lane parses on every kind — keep it.

| Aspect | Spec |
|--------|------|
| Interfaces | <contracts touched — endpoint, CLI flag, function/SDK signature> |
| Data / State | <state it touches — empty if none> |
| Behavior | <the observable behavior after the change> |
| Boundaries | <external deps we DON'T own, faked in tests — empty if none> |
| Tests | <unit/integration — what proves the fix> |

## Task <T-ID> — <short title>
**Slice:** a complete observable behavior end-to-end + tests (full vertical)
**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
- [ ] AC-1 [behavior]: <observable outcome through an interface that proves the fix>
**Tests:** AC-1  ← ordered; first = tracer bullet
<!-- exception: Tests: N/A — reason: config | scaffolding | spike | tooling — the opt-out is part of what you stamp.  Tests: refactor — <what stays green> for behaviour-preserving work (lane proves pass→pass) -->

## Execution Plan
> Approved BY this document's stamp: `lane start` copies this section verbatim into the
> worktree's exec-plan.md and carries your stamp onto it — no separate plan gate. Keep it last.

**Approach:** <high-level how — NOT implementation prescription>
**Boundaries & mocks:** <what's FAKED vs REAL — empty if none>
**Behaviors (TDD order):**
- B-1: <the failing test that proves the bug/behavior, then the change that fixes it>
**Open questions:** <MUST be resolved (or say "none") before the stamp>
