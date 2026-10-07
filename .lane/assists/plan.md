Read this task's execution plan and the frozen spec snapshot beside it, in full — both live
in the task's own folder, and `lane` prints the paths:
docs/features/<FEAT>/tasks/<T-ID>/exec-plan.md and
docs/features/<FEAT>/tasks/<T-ID>/snapshot-TSD.md

Act as a senior Solution Architect reviewing this execution plan before it is approved.
Challenge:
1. Are all the behaviors the approved spec requires represented? (snapshot-TSD.md beside the
   plan IS that spec, frozen at the claim — whatever your kind calls the document it came from.)
   Call out any AC with no corresponding behavior in the plan.
2. Is B-1 a real tracer bullet — does it drive the most load-bearing behavior end-to-end?
3. Are behaviors ordered for TDD (each B-N builds on a passing B-N-1)?
4. Any cross-service or cross-task dependencies that should be in depends_on but aren't?
5. Any auth, permissions, encryption, or PII surface that would push this to Path R routing?

For each gap, ask me to resolve it explicitly. Do not proceed past a gap until I answer.

When all gaps are resolved, say exactly: "assist complete — ready to approve."
