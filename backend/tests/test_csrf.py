"""B-3: CSRF (double-submit) on cookie-authenticated state-changing requests.

An authenticated non-GET request must echo the CSRF cookie in the X-CSRF-Token
header. A missing/mismatched token → 403; a matching token → succeeds. GET reads
are exempt.
"""

_PAYLOAD = {"amount": 100, "category": "Food", "date": "2026-07-01"}


def test_csrf_required_on_authenticated_state_change(make_auth_client):
    c = make_auth_client()  # authenticated; carries session + CSRF cookies + header

    # (a) no CSRF header → 403
    c.headers.pop("X-CSRF-Token", None)
    assert c.post("/api/expenses", json=_PAYLOAD).status_code == 403

    # (b) wrong CSRF header → 403
    c.headers["X-CSRF-Token"] = "not-the-real-token"
    assert c.post("/api/expenses", json=_PAYLOAD).status_code == 403

    # (c) matching CSRF header → succeeds
    c.headers["X-CSRF-Token"] = c.cookies.get("csrf_token")
    assert c.post("/api/expenses", json=_PAYLOAD).status_code == 201

    # a GET read is unaffected by a missing CSRF token
    c.headers.pop("X-CSRF-Token", None)
    assert c.get("/api/expenses").status_code == 200
