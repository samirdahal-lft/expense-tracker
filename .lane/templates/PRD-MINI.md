---
approved_by: ""
approved_at: ""
---
# Mini PRD <FEAT> — <title>
> A small, scoped improvement on top of what already ships (LANE §8). Lighter than a full
> product spec: usually one story, no full success-metrics apparatus. Paired with the technical
> document this kind signs next — `lane` names it. If it grows past a couple of stories it has
> outgrown this document: say so when you hand the gate over, and see `lane kinds` for what
> else this repo offers.

**Parent:** <NNNN of the feature this builds on, if it rolls up to one — optional, prose only>
**Source:** roadmap milestone <M> | real-usage feedback   ← why this exists (audit chain, §4; trace ↑ to docs/ROADMAP.md)

---

## Story S-<FEAT>.01 — <title>
As a <user> I want <capability> so that <value>.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `e2e` = reachable by a real user through the running system.
- [ ] AC-1 [behavior] — <observable outcome through interface>
- [ ] AC-2 [e2e] — <user-reachable end-to-end>   ← every story needs ≥1 `e2e` AC

**Success metric:** <how we know it worked — one line is fine at this size>
