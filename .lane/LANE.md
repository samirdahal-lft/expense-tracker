# LANE — Leapfrog AI-Native Execution

This project uses **LANE**, an AI-native SDLC framework. The flow is enforced
mechanically by the `lane` binary — you run a command, read its output, and do
what it tells you. There is no procedure to memorize here.

## If you are an AI agent

Run the `/lane` slash command to orient yourself. It runs `lane` (your state and
next action) and points you at `lane playbook why` (the mental model) for a
first visit. Everything you need is surfaced by the binary.

In Claude Code, a `SessionStart` hook auto-orients you each session (it runs
`lane orient`), and a `Stop` hook (`lane guard`) keeps you on-task to each gate —
both scaffolded by `lane init --agent claude`. They are an autonomy driver, not a
gate: human approvals and the TDD ledger are unchanged.

## If you are a human

Run these in your terminal:

- `lane` — current state and your next action
- `lane playbook why` — the reasoning behind every hard rule; `lane playbook` for the rest
- `lane philosophy` — the long form of that reasoning
- `lane dashboard` — the live web view: state, documents, review and approvals
- `lane help` — every command

That's it. The binary is the source of truth; it is versioned with the code and
cannot drift the way a static document does.
