---
adr-baseline: 1
version: 2
last-updated: 2026-07-20
---

# Architecture — Expense Tracker

> Greenfield draft: intended architecture for a project with no code yet. Review and ratify.

## System Context
```mermaid
graph TD
  user[Single user] --> web[React + Vite SPA]
  web -->|HTTP/JSON| api[FastAPI backend]
  api -->|SQL| db[(SQLite file)]
```

## Containers
- **Web SPA** — React 18 + TypeScript, built with Vite. Renders the UI and calls the backend
  over HTTP/JSON through a typed API client. No direct DB access.
- **API backend** — FastAPI (Python). Exposes a REST/JSON API. Layered internally as
  `router → service → repository`. Owns all business rules and the only path to the database.
- **Database** — SQLite, a single local file. Accessed exclusively by the backend's repository layer.

## Deployment Topology
```mermaid
graph TD
  subgraph compose[docker compose]
    fe[frontend container<br/>React + Vite build, served] -->|HTTP/JSON| be[backend container<br/>FastAPI]
    be -->|SQL| dbfile[(SQLite file)]
  end
  dbfile -.persisted on.-> vol[[named volume]]
```
- The stack runs via **`docker compose up`**, bringing up two service containers — **frontend**
  and **backend** — plus the SQLite database the backend owns.
- The **frontend** container serves the built React + Vite SPA; the **backend** container runs
  the FastAPI app and is the only process that opens the SQLite file.
- The SQLite file lives on a **named Docker volume**, so recorded data persists across
  `docker compose down` / `up`. The DB file is never baked into an image or committed to git.

## Boundary Rules
- The SPA never touches the database directly — all data flows through the FastAPI HTTP API.
- All database access goes through the repository layer; services and routers never issue SQL directly.
- Business/domain logic lives in the service layer — not in routers (thin) and not in repositories (SQL only).
- All I/O crossing the API boundary is validated/serialized with Pydantic models.
- Currency amounts cross every boundary as integer whole Nepalese Rupees (NPR), never floats.

## Governing ADRs
- [ADR-0001 — Record architecture decisions](../adr/0001-record-architecture-decisions.md)
<!-- add links as ADRs are written, e.g. [ADR-0002 title](../adr/0002-slug.md) -->
