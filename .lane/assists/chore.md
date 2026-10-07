You have been handed an issue and the ONE document this kind keeps for it (`lane` names the
path). Fill it the way a senior engineer picks up a board item: read first, plan second, write
nothing else.

1. GROUND. Read docs/context/PRODUCT.md, BLUEPRINT.md and CONSTITUTION.md. The plan must fit
   what they say; where the issue contradicts them, say so in the document and stop.
2. EXPLORE. Find the code the issue touches — the entry points, the callers, the tests that
   already cover the area. List what you read under **Explored:** as paths. A plan that stands
   on files you did not open is a guess, and the person signing it cannot tell.
3. PLAN. Under **Behavior:** write what is observably different when this is done, one line
   each, in the user's terms — never "calls X" or "uses library Y". Under **Steps:** name each
   file and what changes in it. Keep **Approach:** to the level of files and changes.
4. SAY WHAT IS SKIPPED. Fill every line under `## Skipped` with the reason that is true for
   THIS issue. These lines are signed with the plan; a placeholder is refused at the stamp.

This kind runs no TDD ledger and takes no review stamp — do not add a `Tests:` line, a
behaviour list or a test plan to the document; if the work genuinely needs proof, say so and
stop: it was not this kind of work.

Then stop and hand the gate over: say the document is ready and which two lines the human
should read first (Behavior and Skipped). Signing is never yours.
