# Engineering Constitution — Expense Tracker

> Human-maintained. No frontmatter baseline — update when conventions change, review when onboarding.

## Stack
- Backend runtime: Python 3.12 (confirmed: `backend/Dockerfile`)
- Backend framework: FastAPI 0.111 + uvicorn (confirmed: `backend/requirements.txt`, `backend/app/main.py`)
- Backend validation: Pydantic 2.7 (confirmed: `backend/app/models/expense.py`)
- Backend DB: SQLite, accessed via the stdlib `sqlite3` module — no ORM (confirmed: `backend/app/db.py`)
- Backend test runner: pytest 8.2, via `fastapi.testclient.TestClient` (confirmed: `backend/pytest.ini`, `backend/conftest.py`)
- Frontend runtime: Node 20 (build only) (confirmed: `frontend/Dockerfile`)
- Frontend framework: React 18 + Vite 5 + TypeScript 5.4 (confirmed: `frontend/package.json`)
- Frontend styling: Tailwind CSS 3, class-based dark mode (confirmed: `frontend/tailwind.config.ts`, `frontend/src/hooks/useTheme.ts`)
- Frontend charts: Recharts (confirmed: `frontend/src/features/summary/CategorySummary.tsx`)
- Frontend test runner: Vitest + @testing-library/react + jsdom (confirmed: `frontend/package.json`)
- Serving in production: nginx (static SPA + reverse proxy to backend) (confirmed: `frontend/nginx.conf`)

## Conventions
1. Backend layering is strict router → service → repository → db; a layer only calls
   the one directly below it — NOT: a router calling `app.db` or `repositories`
   directly, or a service importing `fastapi`.
2. Money is always a whole integer (NPR, no fractional currency) — NOT: representing
   `amount` as a `float` anywhere in models, DB schema, or the frontend `Expense`/
   `ExpenseInput` types.
3. Category is a closed, fixed set (`Food`, `Transport`, `Bills`, `Other`) defined once
   per side (`CATEGORIES`/`Category` in `backend/app/models/expense.py` and
   `frontend/src/api/client.ts`) and referenced everywhere else — NOT: hardcoding the
   category list again in a component or a second backend module.
4. An update model (`ExpenseUpdate`) derives from the create model (`ExpenseCreate`)
   rather than restating its fields, so create/update validation rules cannot drift
   apart — NOT: defining `ExpenseUpdate`'s fields independently.
5. All frontend-to-backend calls go through `frontend/src/api/client.ts`'s `apiFetch`
   wrapper, reached via a hook (`useExpenses`, `useSummary`) — NOT: a component calling
   `fetch()` directly.
6. Tests use a hermetic per-test SQLite file injected via `EXPENSE_DB_PATH`
   (`backend/conftest.py`'s `temp_db`/`client` fixtures) — NOT: a backend test touching
   the default `expenses.db` file or a shared/seeded database.
7. The root `backend/conftest.py` (not a file under `tests/`) is where fixtures with no
   test functions live — NOT: adding a non-`test_*.py` helper module inside
   `backend/tests/` (breaks LANE's runner-probe convention; see
   `backend/conftest.py`'s own docstring for the reasoning).

## Hard Rules
- Never let a request body set or overwrite `id` or `created_at` on an expense — both
  are server-owned (`ExpenseCreate`/`ExpenseUpdate` omit them; the repository layer
  never writes them from request data) — a bypass would let a client forge history.
- Never hardcode the SQLite path — always resolve it through `app.db.get_db_path()`
  (env var `EXPENSE_DB_PATH`) so tests, dev, and the Docker volume mount stay
  independent and swappable.
- Never do raw SQL outside `backend/app/repositories/` — routers/services must go
  through repository functions, so the query surface stays auditable in one place.
- Always keep `Summary.by_category` covering every entry in `CATEGORIES`, even at zero,
  and keep `total` equal to the sum of `by_category` totals — the frontend donut chart
  and total figure assume this invariant holds (`backend/app/services/expenses.py`).

## File Organization
- `backend/app/models/` → Pydantic request/response schemas (validation + serialization)
- `backend/app/repositories/` → all SQL; the only code that imports `app.db`
- `backend/app/services/` → business/domain logic; called by routers, calls repositories
- `backend/app/routers/` → FastAPI route definitions; thin, delegate to services
- `backend/app/db.py` → connection + schema bootstrap only
- `backend/tests/` → pytest test files (`test_*.py` only — fixtures go in root `conftest.py`)
- `frontend/src/api/` → the single typed HTTP client (`client.ts`)
- `frontend/src/hooks/` → data-fetching/state hooks that wrap the API client for components
- `frontend/src/features/<name>/` → one directory per UI feature (component + its test)
- `frontend/src/lib/` → small stateless helpers (formatting, class-name utilities)
- `docs/` → LANE artifacts (specs, tasks, context, ADRs)

## Open questions (human to answer)
- No stated backend error-response shape/taxonomy beyond FastAPI's default
  `HTTPException` `{"detail": ...}` — if a richer error contract is wanted later, it
  should be decided and recorded here rather than inferred per-endpoint.
- No stated naming convention for frontend test files beyond co-locating
  `X.test.tsx` next to `X.tsx` — this is observed in every case but not written down
  as a rule anywhere; flagging as inferred, not confirmed as a deliberate policy.
