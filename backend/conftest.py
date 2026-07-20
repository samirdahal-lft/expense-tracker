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
