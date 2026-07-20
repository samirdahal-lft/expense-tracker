"""Toolchain sanity check — proves pytest collects and the app imports/boots.

Not a product test (this task is Tests: N/A — scaffolding). Feature behavior is
asserted by the red-green tasks that follow.
"""
from fastapi.testclient import TestClient

from app.main import create_app


def test_app_boots_and_reports_healthy():
    client = TestClient(create_app())
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}
