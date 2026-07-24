"""B-4: POST /api/auth/logout ends the session immediately, no confirmation.

After logout the session cookie is cleared and subsequent protected requests
are rejected as unauthenticated.
"""


def test_logout_ends_session_immediately(make_auth_client):
    c = make_auth_client()  # authenticated; carries session + CSRF cookies + header
    assert c.get("/api/auth/me").status_code == 200  # sanity: logged in

    resp = c.post("/api/auth/logout")

    assert resp.status_code == 200  # no confirmation step
    # session ended → protected routes now reject
    assert c.get("/api/auth/me").status_code == 401
    assert c.get("/api/expenses").status_code == 401
