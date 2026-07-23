# Engineering Constitution — Expense Tracker

> Human-maintained. No frontmatter baseline — update when conventions change, review when onboarding.
> Greenfield draft: these are the *intended* conventions for a project with no code yet. Review and ratify.

## Stack
- Runtime: Python 3.11+ (backend) · Node 20+ (frontend tooling)
- Language: Python (backend) · TypeScript (frontend)
- Framework: FastAPI (backend) · React 18 + Vite (frontend)
- Styling / UI: Tailwind CSS + shadcn/ui component primitives (frontend)
- Charts: Recharts (frontend) — used for the category donut chart
- Auth: password hashing via `passlib[bcrypt]`; session via an httpOnly signed cookie
  (`itsdangerous`) holding the user id — no JWT-in-localStorage, no server-side session table
- DB: SQLite (single file, multi-user — every row scoped to its owning user)
- Test runner: pytest (backend, root `backend/`) · Vitest (frontend, root `frontend/`)

## Conventions
1. Backend request flow is `router → service → repository → SQLite` — NOT: SQL or business logic inside route handlers.
2. Money is whole Nepalese Rupees (NPR), stored and computed as integer rupees (no paisa/sub-rupee precision) — NOT: floats for currency amounts.
3. API request/response bodies are Pydantic models; the DB layer uses its own models — NOT: passing raw dicts or ORM rows across the API boundary.
4. Frontend server state goes through a typed API client module; components consume hooks — NOT: raw `fetch` calls scattered in components.
5. Dates/timestamps are stored as ISO-8601 UTC — NOT: locale-formatted date strings in the DB.
6. Every user-owned table (expenses, and any added later) carries a `user_id` column and every
   repository query filters by the authenticated user's id — NOT: a query that returns rows
   across users, even transiently.

## Hard Rules
- Never store currency as a floating-point number — money is integer whole NPR; rounding drift corrupts totals.
- Frontend styling goes through Tailwind utility classes + shadcn/ui primitives — NOT: ad-hoc CSS files or a second component library.
- Always route DB access through the repository layer — keeps SQL in one place and testable.
- Never commit the SQLite database file or `.env` — data and secrets stay out of git.
- Always validate/serialize at the API boundary with Pydantic — no unvalidated input reaches services.
- Never store a plaintext password — always hash with `passlib[bcrypt]` (or `argon2-cffi`) before persisting.
- Every route that touches expense/summary data must require an authenticated user and scope
  its query to that user's id — a route reachable without auth, or a query missing the
  `user_id` filter, is a security defect, not a style nit.

## File Organization
- `backend/` → FastAPI app: `app/routers/`, `app/services/`, `app/repositories/`, `app/models/`, `app/db.py`; tests in `backend/tests/`.
- `frontend/` → React + Vite app: `src/api/` (typed client), `src/components/`, `src/hooks/`, `src/pages/`; tests co-located as `*.test.tsx`.
- `docs/` → LANE artifacts (specs, tasks, context, ADRs).

<!-- Open questions for the human:
     - Resolved: auth model is full multi-user accounts (signup/login), not a single passcode
       (see Stack: Auth, and Convention 6 / the auth Hard Rules above).
     - Python dependency manager (pip + requirements.txt assumed) and JS package manager (npm assumed)?
     - Error-response envelope shape (not yet decided). -->
