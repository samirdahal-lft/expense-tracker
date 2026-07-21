## TSD S-0001.03 — Delete an expense  (PRD §S-0001.03)
| Aspect | Spec |
|--------|------|
| Interfaces | `DELETE` expense-by-id endpoint. Deleting an existing id succeeds (success/no-content status); a subsequent list omits it. Deleting an unknown id returns a not-found status and mutates nothing. |
| Data / State | Removes the matching row from the expenses store; no cascade. |
| Behavior | A per-row delete removes the expense. In the UI the row disappears and the category summary re-reflects the change without a manual page reload. An unknown id is reported as not-found and leaves the store unchanged. |
| Access | The single local user. |
| Boundaries | Persistent store (delete). |
| Tests | unit: not-found path leaves state unchanged. integration: delete existing id → gone from a subsequent list; delete unknown id → not-found + count unchanged. smoke: delete a row in the running app; list and summary update. |

---
