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
