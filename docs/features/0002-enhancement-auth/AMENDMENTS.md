# Amendments — 0002-enhancement-auth
> Append-only. Never edit an entry after writing it.

## Amendment A-0002-01 — 2026-07-23
**Type:** Shallow
**Trigger:** verification finding (human review)
**What changed:** T-008's auth implementation was switched from a stdlib-only approach
(`hashlib.pbkdf2_hmac` for the password verifier + hand-rolled `hmac` for the session
cookie signature) to the CONSTITUTION-mandated libraries: password hashing via
`passlib[bcrypt]` and session signing via `itsdangerous`. `requirements.txt` gains pinned
`passlib==1.7.4`, `bcrypt==4.1.3`, `itsdangerous==2.2.0`. The exec-plan's Approach /
Boundaries / PR-contents were corrected accordingly (reopening its approval gate).
**Why:** The approved exec-plan's stdlib choice diverged from CONSTITUTION (Stack → Auth:
"password hashing via `passlib[bcrypt]`; session via an httpOnly signed cookie
(`itsdangerous`)"; Hard Rules: "always hash with `passlib[bcrypt]` (or `argon2-cffi`)"). This
was a spec-grounding miss during planning, caught at verification. Conforming to the stated
convention rather than ratifying a parallel stdlib approach into CONSTITUTION.
**Cascade:** Code (T-008: `app/services/auth.py`, `app/session.py`, `backend/requirements.txt`)
+ exec-plan.md. PRD/TSD unchanged — the TSD is deliberately library-agnostic ("one-way, salted
transformation"; "signed cookie"), so both implementations satisfy it; only the CONSTITUTION
convention distinguishes them. Behavior, ACs, and all tests unchanged (they assert properties,
not the algorithm).
**ADR update:** No

## Amendment A-0002-02 — 2026-07-24
**Type:** Shallow
**Trigger:** verification/planning finding (human decision at T-009 planning)
**What changed:** TSD S-0002.02 "Data / State" was corrected. It previously said "no new
persistent schema beyond session state," which conflicts with the same story's Interfaces
("derive `user_id`"), Behavior/AC-5 ("a session only ever reads or mutates its own account's
rows"), and Tests ("returns only the caller's rows"; "cross-account isolation"). Isolation is
impossible unless expense rows are owned by an account, so T-009 adds a `user_id` column to the
`expenses` table and scopes every expense/summary query to the authenticated user's id.
**Why:** The MVP built `expenses` single-user (no `user_id`). CONSTITUTION convention 6 and
BLUEPRINT both mandate that every user-owned row carries `user_id` and every query filters by
the authenticated user. The old Data/State line was an under-specification, not a real
constraint; correcting it makes the TSD internally consistent with its own isolation ACs.
**Cascade:** TSD §S-0002.02 (Data/State wording) + Code (T-009: `app/db.py` expenses schema,
`app/repositories/expenses.py`, `app/services/expenses.py`, `app/routers/expenses.py`, and their
tests). PRD unchanged (isolation was already the stated success metric). Pre-auth expense rows
are disposable (already resolved), so no data migration/backfill.
**ADR update:** No (convention already stated in BLUEPRINT/CONSTITUTION; this conforms to it)
