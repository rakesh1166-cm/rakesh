"""Contract tests for the home + health endpoints.

The DB test asserts on the response *shape*, so it passes whether or not a
Postgres server happens to be running.
"""

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_home_returns_app_metadata():
    response = client.get("/")
    assert response.status_code == 200

    body = response.json()
    assert body["app"]
    assert body["version"]
    assert body["docs_url"] == "/docs"


def test_health_is_ok():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_db_health_reports_a_typed_status():
    response = client.get("/api/health/db")
    assert response.status_code == 200

    body = response.json()
    assert body["status"] in {"connected", "error"}
    assert body["dialect"] == "postgresql"
    if body["status"] == "error":
        # Errors must be typed and user-safe, never a raw traceback.
        assert body["detail"]
