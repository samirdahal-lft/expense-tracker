---
approved_by: ""
approved_at: ""
---
# Exploration — Task <T-ID> — <TITLE>
> The story of one test case walked on the landed build — QA stamps it before any e2e is written.
<!-- For the explorer (assist_explore has the full recipe): each `## Step` heading IS the frozen
case — never edit, add, drop or reorder one. Under each step fill Did / Saw / Verdict (pass | fail
| blocked) and show a screenshot named for the step: ![step 3](exploration/03-<what>.png), 03a-,
03b- for several. Saw is what happened; if it differs from the heading, the verdict is fail.
Traces and video go in exploration/ (git-ignored, bound by sha256). Then: lane explore --record <T-ID> -->

**Explored-At:** <EXPLORED-AT> (<REF>)
**Source:** <SOURCE> — all <LANDED> task(s) landed
**Environment:** <base URL · browser · viewport>
**Explorer:** <agent + tool version (e.g. playwright-cli 0.1.x), or a person>

<STEPS>

## Outcome
**Outcome:** <written by lane explore --record, from the step verdicts>
**Classification:** <only on fail/blocked: product (the build is wrong) | case (the test case is wrong or unclear) | environment (the run could not happen)> — <one line why>

### Bug (only on fail — this becomes the fix ticket's evidence)
**Summary:** <the problem, not a solution>
**Steps to reproduce:** <the failing step numbers above>
**Expected / Actual:** <from the case / what was seen>

### Obstacles
- <what limited the exploration itself — missing data, a flaky boot — never a product bug>

### Artifacts
- <trace.zip — npx playwright show-trace exploration/trace.zip · video.webm (one chapter per step)>
