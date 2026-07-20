"""SQLite connection bootstrap.

The database path comes from the ``EXPENSE_DB_PATH`` environment variable so it
can be pointed at a temp file in tests and at the mounted volume in Docker,
without any code change. The repository layer (added by feature tasks) is the
only caller of ``get_connection``.
"""
import os
import sqlite3

DEFAULT_DB_PATH = "expenses.db"


def get_db_path() -> str:
    return os.environ.get("EXPENSE_DB_PATH", DEFAULT_DB_PATH)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn


SCHEMA = """
CREATE TABLE IF NOT EXISTS expenses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    amount     INTEGER NOT NULL,
    category   TEXT    NOT NULL,
    date       TEXT    NOT NULL,
    note       TEXT,
    created_at TEXT    NOT NULL
);
"""


def init_db() -> None:
    """Create the expenses table if absent. Idempotent; safe to call on every boot."""
    conn = get_connection()
    try:
        conn.executescript(SCHEMA)
        conn.commit()
    finally:
        conn.close()
