## TSD S-0001.06 — One-command Dockerized run  (PRD §S-0001.06)
| Aspect | Spec |
|--------|------|
| Interfaces | A single compose entrypoint (`docker compose up`) starts the frontend service, the backend service, and the backend's SQLite-backed store; the app is reachable in a browser. |
| Data / State | The SQLite database file resides on a **named volume**, decoupled from container lifecycle. Not baked into any image; never committed to git (CONSTITUTION hard rule). |
| Behavior | `docker compose up` from a fresh clone brings up frontend + backend and the user can add / list / delete expenses end-to-end. Data recorded before `docker compose down` is still present after a subsequent `up` (volume-persisted). |
| Access | The single local user / operator. |
| Boundaries | Container runtime; the host Docker volume (filesystem persistence). |
| Tests | smoke (critical path, required — boundary is non-empty): from a clean state, `docker compose up`, create an expense, `down` then `up`, and confirm the expense persists and the app is reachable. |
