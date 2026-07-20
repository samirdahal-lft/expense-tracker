"""Shared pytest fixtures: a hermetic temp SQLite DB and a TestClient bound to it.

Kept OUT of conftest.py on purpose: LANE's runner probe globs `*test*.py`, and
"conftest" matches that substring, so a bare conftest (0 tests) would be probed
first and look like a broken runner. Test modules import these fixtures
explicitly instead — pytest resolves them by name once they're in scope.

The DB path is injected via EXPENSE_DB_PATH (per-test temp file), so tests never
share state and replay cleanly in a fresh worktree.
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
