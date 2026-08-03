# Engineering Constitution — Expense Tracker

> Human-maintained. No frontmatter baseline — update when conventions change, review when onboarding.

## Stack

Backend (`backend/`)
- Runtime: Python 3.12 (`backend/Dockerfile`), served by uvicorn 0.30
- Language: Python with type hints on every function signature, including `-> None`
- Framework: FastAPI 0.111 + Pydantic v2 (`pydantic==2.7.4`)
- DB: SQLite via the stdlib `sqlite3` module — **no ORM, no migration tool**
- Test runner: `pytest` 8.2 (`backend/pytest.ini`: `pythonpath = .`, `testpaths = tests`),
  HTTP-level tests through `fastapi.testclient.TestClient` + `httpx`
- Dependencies: **fully pinned** in `backend/requirements.txt` (direct deps are fastapi,
  uvicorn[standard], pydantic, pytest, httpx; the rest are transitive) so a fresh worktree or
  container resolves identically — LANE replays RED/GREEN in a clean checkout

Frontend (`frontend/`)
- Runtime: Node 20 to build; nginx 1.27-alpine to serve (`frontend/Dockerfile`)
- Language: TypeScript 5.4, `strict: true` + `noUnusedLocals` + `noUnusedParameters`
- Framework: React 18 function components + hooks; Vite 5 build/dev server
- Styling: Tailwind CSS 3.4 with shadcn/ui token conventions (`components.json`,
  `darkMode: ["class"]`), HSL CSS variables in `frontend/src/index.css`
- Charts: Recharts 2.12. Icons: lucide-react
- Test runner: Vitest 1.6 + jsdom + Testing Library (`npm test` → `vitest run`;
  config lives in `frontend/vite.config.ts`, setup in `frontend/src/test/setup.ts`)

Delivery
- Docker Compose: `frontend` (published `8090:80`) + `backend` (internal only) + a `db-data`
  volume holding the SQLite file at `/data/expenses.db`

## Conventions

1. **Money is an integer number of whole NPR, end to end** (`amount: int = Field(gt=0)`,
   `amount: number`) — NOT: a float, a Decimal, paisa/cents, or a formatted string in the model.
2. **Format money only at the display edge**, via `formatNpr()` in `frontend/src/lib/format.ts`
   (`2500 → "Rs 2,500"`) — NOT: `` `Rs ${amount}` `` inline in a component, and never a
   pre-formatted amount from the API.
3. **The API speaks snake_case; TypeScript mirrors it verbatim** (`created_at`, `by_category`)
   — NOT: camelCasing the wire format or adding a mapping layer between client and API.
4. **One typed function per endpoint in `frontend/src/api/client.ts`, called through
   `apiFetch`** — NOT: a bare `fetch("/api/...")` inside a component or hook.
5. **Data loading lives in a `use*` hook returning `{ data, loading, error, reload }`**
   (`useExpenses`, `useSummary`) — NOT: `useEffect` + `fetch` inside a feature component.
6. **Feature components are presentational: props in, callbacks out; `App.tsx` composes them**
   — NOT: a feature component fetching its own data or reaching into another feature.
7. **Style with semantic Tailwind tokens** (`bg-card`, `text-muted-foreground`,
   `text-destructive`) so light and dark both work — NOT: `bg-white`, `text-gray-500`, or a hex
   literal in a `className`. (Known exception, flagged in-file: the category chart palette in
   `CategorySummary.tsx` is hardcoded hex and is not yet theme-aware.)
8. **Interactive controls carry an accessible name and a `type`** — icon-only and repeated
   buttons get a specific `aria-label` (`Delete Food expense of Rs 1,000`), every non-submit
   button is `type="button"` — NOT: an unlabeled icon button or four identical "Delete" names.
9. **Every list surface renders loading, error, and empty states explicitly** — NOT: rendering
   `[]` as a blank panel or letting a failed fetch show as "no expenses".
10. **Python modules and public functions carry a docstring that says *why*, not *what*** — the
    existing files state the rule they enforce (e.g. why `ExpenseUpdate` derives from
    `ExpenseCreate`) — NOT: `"""Update an expense."""` restating the signature.
11. **Backend imports are absolute from the `app` package** (`from app.services import expenses
    as service`) — NOT: relative imports like `from ..services import expenses`.
12. **Frontend imports use the `@/` alias for anything outside the current folder**
    (`@/api/client`, `@/lib/format`) — NOT: `../../api/client`.
13. **Tests are named for the behavior they prove and reference their LANE behavior ID** —
    backend: a module docstring `"""B-1: POST /api/expenses creates …"""` in
    `backend/tests/test_<area>_<behavior>.py`; frontend: `describe("B-3: expense list in the
    running app")` in a `*.test.tsx` colocated with the feature — NOT: `test_it_works`, and NOT
    a frontend test in a separate top-level `tests/` tree.
14. **Backend tests exercise the real HTTP surface with a real temp SQLite DB**, via the shared
    `client` / `temp_db` fixtures — NOT: mocking the repository or service layer to test a
    router.
15. **Frontend tests render `App` and stub the global `fetch`** (`vi.stubGlobal`), then assert
    what the user sees by role/label — NOT: mocking `@/api/client` or asserting component
    internals/state.

## Hard Rules

- **Never let SQL leave `backend/app/repositories/`.** A SQL string or `sqlite3` import in a
  router, service, or model breaks the only boundary that keeps the data layer swappable and
  auditable.
- **Never build SQL by string interpolation.** Always bound `?` parameters — an f-string with a
  request value in it is an injection hole in a file that owns the entire dataset.
- **Never accept `id` or `created_at` from a request body.** They are server-owned; a write
  model that includes them lets a client rewrite record identity and history.
- **Never restamp `created_at` on update.** List ordering (`created_at DESC`) is built on it, so
  restamping silently reorders the user's history.
- **Never widen validation for edits.** `ExpenseUpdate` derives from `ExpenseCreate` on purpose —
  restating fields would let editing become a validation bypass and let the two drift apart.
- **Never make `amount` or `category` non-canonical.** Amount stays a positive integer;
  `category` stays the fixed `Literal["Food","Transport","Bills","Other"]`. Adding a category
  means changing **both** `backend/app/models/expense.py` and `frontend/src/api/client.ts` in
  the same task, plus the chart palette.
- **Never read `EXPENSE_DB_PATH` outside `backend/app/db.py`,** and never hardcode a DB path.
  Injection through that one function is what makes tests hermetic and Docker persistent.
- **Never commit the database or secrets.** `*.db` and `.env` are gitignored; a committed
  `expenses.db` would ship someone's spending data.
- **Never leave tests non-hermetic.** Every backend test gets its own temp DB via `temp_db`
  (`EXPENSE_DB_PATH` monkeypatched); every frontend test stubs `fetch` and cleans up in
  `afterEach`. LANE replays the ledger in a fresh worktree — a test leaning on a seeded DB, your
  shell env, or the network passes at GREEN and fails at verify.
- **Never put a non-test `.py` file in `backend/tests/`.** Shared fixtures live in the root
  `backend/conftest.py` (see its docstring): pytest auto-loads a root conftest, and LANE's runner
  probe takes the alphabetically-first file in the test dir — a fixture-only module there makes
  the probe land on a file with zero tests.
- **Never raise `HTTPException` below the router.** Services return a value or `None`/`False`;
  the router decides the status code. Otherwise the domain layer becomes HTTP-coupled.
- **Always route browser → API through nginx's `/api/` proxy** (`frontend/nginx.conf`). The
  backend port is deliberately unpublished; calling it directly from the browser would require
  exposing it and adding CORS.
- **Always keep `init_db()` idempotent.** It runs on every boot against a live volume, and there
  is no migration tool — a non-idempotent or destructive schema step would drop real data.

## File Organization

- `backend/app/main.py` → FastAPI app factory (`create_app`), `/health`, router registration
- `backend/app/db.py` → connection factory, `SCHEMA`, `init_db()`; the sole reader of
  `EXPENSE_DB_PATH`
- `backend/app/models/` → Pydantic request/response models + the `Category` literal and
  `CATEGORIES` tuple
- `backend/app/routers/` → `APIRouter`s (prefix `/api`); HTTP concerns only
- `backend/app/services/` → domain logic, the clock, cross-record rules
- `backend/app/repositories/` → all SQL; plain values in, dicts out
- `backend/conftest.py` → shared `temp_db` / `client` fixtures (root, deliberately not in `tests/`)
- `backend/tests/test_<area>_<behavior>.py` → one file per behavior slice, flat (no subdirs today)
- `frontend/src/main.tsx` → React entry; `frontend/src/App.tsx` → composition root
- `frontend/src/api/client.ts` → the only `fetch` caller; shared wire types
- `frontend/src/hooks/` → `use*` data/state hooks, one per resource or concern
- `frontend/src/features/<feature>/` → feature components **plus their `*.test.tsx`**, colocated
- `frontend/src/lib/` → pure helpers (`format.ts` money formatting, `utils.ts` the `cn` helper)
- `frontend/src/index.css` → Tailwind layers + the light/dark HSL variable sets
- `frontend/src/test/setup.ts` → Vitest global setup (jest-dom, `ResizeObserver` polyfill)
- `docs/` → LANE artifacts (specs, tasks, context, ADRs); `docker-compose.yml`, `*/Dockerfile`,
  `frontend/nginx.conf` → delivery

## Open questions for the human (the code is silent — do not invent an answer)

- **No linter or formatter is configured** in either tier (no ruff/flake8/black/eslint/prettier
  config, no `lint` script). Conventions above are read off the existing code, not enforced by a
  tool. Decide whether to adopt one.
- **No CI workflow and no README/run instructions** exist. The run path was reconstructed from
  `docker-compose.yml` and the package scripts.
- **`.lane/lane.config` has `test_cmd` empty and the `runner.*` matrix commented out**, even
  though this is a two-harness repo (pytest in `backend/`, vitest in `frontend/`). `lane
  red/green` cannot run until the runner matrix is filled in and committed on the integration
  branch. Note `.lane/` is currently untracked.
- **No error-response convention beyond FastAPI's default** `{"detail": "..."}`; there is no
  error taxonomy or error code scheme. Also no logging setup, no request IDs, no
  `.env.example`.
- **Frontend error handling surfaces the raw message** (`API GET /expenses failed: 500`) to the
  user. Whether that is acceptable UX or a placeholder is undecided.
