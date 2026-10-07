---
description: Activate LANE — AI-native SDLC workflow for this project
---

Run these commands now, in order. Read every line of output before proceeding.

```
lane
lane fold status
```

**What each gives you:**
- `lane playbook why` — the mental model: why every hard rule exists. Read it fully the FIRST time you work in a LANE repo and let it constrain how you read every later `lane` output. The rest of the playbook is reference, pulled on demand: `lane playbook sections` lists the slices (`flow` when planning, `tdd` before writing tests); `lane help` lists the commands; `lane philosophy` is the long form of the why. The `lane` commands print your next step as you go, so you rarely need more.
- `lane` — current state + your next concrete action. This is the oracle for what to do next.
- `lane fold status` — whether the architecture snapshot doc is stale. If stale: run `lane fold`, apply its output in a standalone PR before touching any feature work.

If `LANE_SCOPE` is set in your environment, your scope is fixed and `lane` already answers for it.

---

Then output **exactly** this block — no preamble, no LANE acronyms without a plain-English gloss the first time, no symbols (★, §):

**Where you are:** [One sentence. What is active (feature name, task name), what step, what phase. Plain English.]

**What to do next:**

[List only the commands valid right now. For each: the exact command, two spaces, an em dash, one plain-English sentence on what it does. If `lane` showed a gate box, include the exact steps the human must complete before any command can run.]

---

## Session rules — binding for all work in this project until told otherwise

**The CLI is the oracle.**
Run `lane` after every command. Your next action is always what `lane` outputs — never what you infer from memory or context. If uncertain, run `lane`.

**Approval gates require human confirmation — you cannot close them silently.**
When `lane` shows a gate (a box labeled "human required" or a step named `approve-*`):
1. Tell the human the gate is ready and what artifact it covers.
2. Ask them to run `lane approve` in their own terminal — it shows a digest and asks y/N,
   then writes the approval stamp itself (name, date, content hash).
3. NEVER edit `approved_by`/`approved_at`/`approved_sha256` yourself — a hand-typed stamp
   does not validate (the hash check rejects it), and faking a terminal to answer the
   prompt is forbidden circumvention.
4. Then STOP and tell the human to reply `continue` once they have approved. When they do,
   your next turn picks up the now-unblocked step automatically.
Never auto-approve silently. The human's keypress is the gate.

**Completion is the merge — hand off at a done task.**
When `lane` reports a task is `done`, the work and its verification are complete; what
remains is the merge. By default, tell the human to merge the PR (or run `lane land <id>`)
and reply `continue` — then stop. (If `lane.config` sets `auto_land: true`, run `lane land
<id>` yourself instead.)

**Autonomy mode.**
Default is attended: when you are genuinely blocked or need a human decision, ask and stop —
the human is present. If `lane.config` sets `autonomy_mode: unattended`, never stop to ask:
pick the recommended option, note why, and proceed.

**If a `lane` hint names an assist, run it before drafting/approving.**
When the "Next:" output shows an `assist:` line, the operator has configured a project-tuned
prompt for this authoring step. Apply it before you finish
the artifact — it may tell you to invoke a skill or spawn a subagent. It is advisory, not a gate:
a `⚠ … not found` assist line is a skip, not a blocker, and the human approval stamp is still the
only thing that closes the gate. Never treat running an assist as approval.

**No code before every gate this kind has is passed — and `lane` is what names them.**
For every task: `lane plan <T-ID>` scaffolds the plan. Whether it is SIGNED depends on the kind.
Read the binary, never this file: when `lane` shows an `approve-*` step, that gate is real — the
human reviews and approves (`lane approve <T-ID>`), and producing implementation before it
succeeds violates the pipeline. When `lane` says `no plan gate on <kind>`, there is NO plan approval and none will ever arrive: fill the plan and
proceed to the step `lane` names. Do not wait for a stamp the kind does not collect, and never
invent one — the gates a kind keeps are its definition's, in `.lane/kinds/<kind>.json`.

**TDD cycle: failing test first, always.**
For each behavior in the execution plan:
1. Write the failing test — commit it with `lane red <T-ID>`.
2. Implement until the test passes — commit with `lane green <T-ID>`.
3. Optionally clean up — commit with `lane refactor <T-ID>`.
Never write implementation before the failing test is committed. Never skip a behavior.

**The anchored review: check who performs it before you review anything.**
`lane review <T-ID>` prints who the reviewer is, because `lane.config` declares it (`critic_mode`).
- `human` — **you do not review the diff, and you do not spawn a Critic.** Run `lane review`, then
  stop and hand over: the human reads the frozen `snapshot-TSD.md` against `git diff <base>...<T-ID>`,
  fills `verification.md`, and resolves its flags (in `lane dashboard` or their editor). Reviewing it
  yourself burns the tokens the declaration exists to save, and adds no external signal.
- `subagent` — the ONE mode that asks for a Critic: spawn it with FRESH context, giving it ONLY
  the frozen snapshot and the diff, never your build reasoning. Then fill the report from its findings.
- undeclared — **do not spawn a Critic on your own.** lane has not been told who reviews, so it
  asks for nobody: run `lane review`, follow the handoff it prints, and if the choice is yours to
  make, raise it with the human (declaring `critic_mode` once ends the ambiguity).
In every mode the report is signed by a human running `lane approve <T-ID>` — never by you.

**Context docs are read-only during active feature work.**
`docs/context/PRODUCT.md`, `BLUEPRINT.md`, and `CONSTITUTION.md` describe the product and architecture. Never edit them mid-feature. If `lane fold status` reports stale, fold and update in a standalone PR — then resume the feature.

**Ground every spec in the context docs.**
Unless `lane fold status` reports `Context grounding: OFF`, the context docs are binding constraints on every document you draft or edit — every artifact your kind names, plus cards and exec-plans. Read all three before drafting, and keep the draft consistent with them:
- `docs/context/CONSTITUTION.md` — stack + conventions. Match them; reuse the existing patterns and types, don't invent parallel ones.
- `docs/context/BLUEPRINT.md` — architecture, containers, boundary rules. Stay inside them.
- `docs/context/PRODUCT.md` — what the product is and is not. Stay in scope.
A doc that `lane fold status` marks `stub` or `absent` carries no constraints yet — that is NOT a licence to invent. Don't fabricate constraints from a scaffold. For the documents your kind places BEFORE its grounded one, note it is worth filling and proceed (a greenfield repo's first scoping document is what defines the product). For **the document your kind marks `grounded` it is a hard gate** (ADR-0020) — run `lane` and read the step name, it is whatever that kind calls it: `lane approve` refuses that document while any context doc is `stub`/`absent`, because it invents architecture and must ground in real constraints. Run `lane hydrate` — it PRINTS the method for drafting the docs (it writes nothing); follow it or hand it to a subagent, have a human review the result, then approve. Any change that needs to break a stated convention or boundary is an open question for the human or a candidate ADR — never a silent divergence. When `lane fold status` reports grounding is OFF, the operator handles this (e.g. via assists) — follow those instead.
