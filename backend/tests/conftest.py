"""Shared test fixtures: a hermetic temp SQLite DB and a TestClient bound to it.

The DB path is injected via EXPENSE_DB_PATH (per-test temp file), so tests never
share state and replay cleanly in a fresh worktree. `init_db` / `get_connection`
are imported lazily inside fixtures so unrelated tests (e.g. the scaffold smoke)
don't fail to collect before those symbols exist.
"""
import os
import tempfile

import pytest


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
