"""B-5: session signing fails closed when SESSION_SECRET is absent.

The signing secret is an injected boundary (TSD). With no secret configured the
app must refuse to sign/verify a session rather than fall back to a guessable
default key that would let anyone forge a session cookie.
"""
import pytest

import app.session as session


def test_issue_token_fails_closed_without_secret(monkeypatch):
    monkeypatch.delenv("SESSION_SECRET", raising=False)
    with pytest.raises(RuntimeError):
        session.issue_token(1)


def test_verify_real_token_fails_closed_without_secret(monkeypatch):
    # a token signed under a real secret cannot be verified once the secret is gone
    monkeypatch.setenv("SESSION_SECRET", "some-real-secret")
    token = session.issue_token(1)
    monkeypatch.delenv("SESSION_SECRET", raising=False)
    with pytest.raises(RuntimeError):
        session.verify_token(token)


def test_verify_without_cookie_is_none_even_without_secret(monkeypatch):
    # absent cookie short-circuits to None (401 path), never touching the secret
    monkeypatch.delenv("SESSION_SECRET", raising=False)
    assert session.verify_token(None) is None
    assert session.verify_token("") is None
