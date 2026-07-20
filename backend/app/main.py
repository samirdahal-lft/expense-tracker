"""FastAPI application entrypoint.

Registers feature routers and ensures the database schema exists on boot. The
SQLite path is resolved from EXPENSE_DB_PATH (see app.db).
"""
from fastapi import FastAPI

from app.db import init_db
from app.routers import expenses


def create_app() -> FastAPI:
    init_db()

    app = FastAPI(title="Expense Tracker API")

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(expenses.router)

    return app


app = create_app()
