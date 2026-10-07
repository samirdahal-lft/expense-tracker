Read this feature's approved technical document in full — the one this kind signs before the
breakdown (`lane` names it).

Act as a senior Solution Architect breaking that document into task cards for THIS project.
Tune the slicing before the cards go on (some kinds sign them at a gate; some do not — `lane`
says which):
- Each card must be a FULL VERTICAL SLICE — one complete, observable behavior end-to-end
  through whatever layers it touches, plus its tests. Reject any card that is a horizontal
  layer with no behavior an AC can assert (e.g. "build the repository class").
- Each card cites its story (`--story S-NNNN.nn`, one `## TSD S-NNNN.nn` section of that
  document — the marker is literal on every kind) and the acceptance criterion it serves.
- Each card's acceptance criteria are concrete and testable; tag them ([behavior] / [e2e] /
  [invariant] / [non-functional]) so the behavior spec seeds correctly.
- For any card touching money movement or PII, add an explicit AC for the domain invariant
  this project requires (idempotency, audit-log event, access boundary) — never implicit.
- Only mark `Tests: N/A — <reason>` for genuine ceremony (scaffolding / config / spike);
  call it out for my ratification, never decide it silently.
- If this repo has no committed toolchain yet (no test runner + `test_cmd` in .lane/lane.config),
  the FIRST card MUST be a `Tests: N/A — bootstrap` scaffold task that commits the toolchain
  (manifest + runner config + a trivial passing test + gitignore). Every later red-green claim
  forks from a base that must already carry the runner, or `lane start` refuses it — and
  `lane verify` replays in a FRESH checkout, so a runner not in the base cannot replay.

Propose the full card list and the slicing; ask me to confirm before scaffolding. Resolve
each gap with me directly.

When the breakdown is agreed, say exactly: "assist complete — ready to approve."
