"""Shared pytest fixtures: a hermetic temp SQLite DB and a TestClient bound to it.

Lives at the backend ROOT (not tests/) on purpose: pytest auto-loads a root
conftest for fixtures with no imports, and keeping it out of tests/ means LANE's
runner probe (which picks the alphabetically-first file in the test dir) always
lands on a real `test_*.py`, not a fixture-only module with zero tests.

The DB path is injected via EXPENSE_DB_PATH (per-test temp file), so tests never
share state and replay cleanly in a fresh worktree.
"""
import os
import tempfile

import pytest


@pytest.fixture(autouse=True)
def _session_secret(monkeypatch):
    """Deterministic session-signing secret so cookie issue/verify replays cleanly
    in a fresh worktree (mirrors the EXPENSE_DB_PATH env seam)."""
    monkeypatch.setenv("SESSION_SECRET", "test-session-secret-fixed")


@pytest.fixture()
def temp_db(monkeypatch):
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    monkeypatch.setenv("EXPENSE_DB_PATH", path)
    from app.db import init_db

    init_db()
    yield path
    os.remove(path)


@pytest.fixture()
def client(temp_db):
    from fastapi.testclient import TestClient

    from app.main import create_app

    return TestClient(create_app())


@pytest.fixture()
def make_auth_client(temp_db):
    """Factory: a TestClient registered + logged in as a distinct account, with the
    CSRF header pre-set (double-submit) so state-changing requests pass the CSRF check.
    Multiple calls → independent accounts sharing the same temp DB (for isolation tests)."""
    from fastapi.testclient import TestClient

    from app.main import create_app
    from app.session import CSRF_COOKIE_NAME, CSRF_HEADER_NAME

    app = create_app()

    def _make(email: str = "ada@example.com", name: str = "Ada", password: str = "hunter2pw"):
        c = TestClient(app)
        resp = c.post(
            "/api/auth/register",
            json={"name": name, "email": email, "password": password, "confirm_password": password},
        )
        assert resp.status_code == 201, resp.text
        c.user_id = resp.json()["id"]  # convenience for tests that seed owned rows
        token = c.cookies.get(CSRF_COOKIE_NAME)
        if token:
            c.headers[CSRF_HEADER_NAME] = token
        return c

    return _make


@pytest.fixture()
def auth_client(make_auth_client):
    """A single authenticated client (account 'ada@example.com')."""
    return make_auth_client()
