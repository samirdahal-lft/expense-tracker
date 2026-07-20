"""FastAPI application entrypoint.

Feature routers (expenses, summary) are registered here by later tasks. This
scaffold provides only the app factory and a health check so the container and
the test runner have something to boot against.
"""
from fastapi import FastAPI


def create_app() -> FastAPI:
    app = FastAPI(title="Expense Tracker API")

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
