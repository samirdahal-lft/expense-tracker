You are EXPLORING one QA test case on the landed build (ADR-0032) — a manual tester holding the
case sheet, not a test author. Nothing you write here is test code. `lane explore` printed the
build to boot, the storyboard to fill and the evidence folder.

Tool: the Playwright CLI (`npm i -g @playwright/cli`; `playwright-cli --help`). Shell commands, so
every action is visible and a person could repeat it exactly. Playwright MCP is fine too — the
report is the same.

1. Boot the app from the build lane prepared, the way the e2e harness does (its webServer /
   the project's start command). Use the case's own preconditions and test data — never state a
   previous run left behind.
2. Start the evidence: `playwright-cli open <url>`, `playwright-cli tracing-start`,
   `playwright-cli video-start exploration/video.webm` (paths relative to the task folder lane named).
3. For EACH `## Step` in the storyboard, in order:
   - `playwright-cli video-chapter "Step N — <heading>"`
   - do what the step says (`snapshot` first to find elements; `click`, `fill`, `goto`, …).
     Element refs (`e5`, `f1e2`) belong to ONE snapshot: after any action that changes the page
     (a click that navigates, a submit, a reload) run `snapshot` again before targeting anything
     — an old ref fails with "Ref … not found".
   - `playwright-cli screenshot --filename=<evidence folder>/NN-<what-it-shows>.png` (NN = the
     step number, two digits; `NNa-`, `NNb-` for several — in the order they happened)
   - under the step write **Did:** (the commands, briefly), **Saw:** (what the app actually showed,
     in plain words) and **Verdict:** pass | fail | blocked, then the screenshot line
     `![step N](exploration/NN-<what>.png)`.
4. Judge ONLY against the step heading — it is the signed case. If what you saw differs from it in
   any way, the verdict is fail. Never reword a heading, never "pass with a note", never decide
   the case meant something else: an unclear case is a `case` failure for QA to amend.
5. A step you could not perform (app down, missing data, a broken environment) is `blocked`, not
   fail — write why under Obstacles.
6. Stop the evidence: `playwright-cli tracing-stop`, then zip what it wrote — it leaves a raw
   trace FOLDER (`.playwright-cli/traces/`: `*.trace`, `*.network`, `resources/`), not a zip:
   `(cd .playwright-cli/traces && zip -qr <evidence folder>/trace.zip .)` — a fresh traces folder
   per exploration, so one trace never carries another run. Then `playwright-cli video-stop`. On a fail or blocked, fill **Classification** (product | case |
   environment) and, for a product fail, the Bug section — it becomes the fix ticket.
7. Run `lane explore --record <T-ID>`, fix whatever it refuses, and hand the storyboard to QA.

Never use a tool that rewrites expected values to make a run pass (Playwright's healer agent).
Never read the product's source code to decide a verdict — the build's behaviour is the evidence.
