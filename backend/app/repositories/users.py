"""User repository — the only place SQL touches the users table."""
import sqlite3

from app.db import get_connection


def create_user(name: str, email: str, password_hash: str, created_at: str) -> dict | None:
    """Insert one account and return the created row, or None if the email is taken."""
    conn = get_connection()
    try:
        try:
            cur = conn.execute(
                "INSERT INTO users (name, email, password_hash, created_at) "
                "VALUES (?, ?, ?, ?)",
                (name, email, password_hash, created_at),
            )
        except sqlite3.IntegrityError:
            return None
        conn.commit()
        row = conn.execute(
            "SELECT id, name, email, password_hash, created_at FROM users WHERE id = ?",
            (cur.lastrowid,),
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_user_by_email(email: str) -> dict | None:
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?",
            (email,),
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_user_by_id(user_id: int) -> dict | None:
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT id, name, email, password_hash, created_at FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()
