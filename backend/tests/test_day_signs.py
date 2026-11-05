import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.repositories import day_signs
from app.services.day_signs import get_day_sign, list_day_signs


ROW = {
    "name": "Cipactli",
    "english": "Crocodile",
    "position": 1,
    "description": "Cipactli evokes the living earth and new beginnings.",
    "meaning_and_glyph": "A composite aquatic-earth creature.",
    "symbolism": "Earth, nourishment, and beginnings.",
    "cultural_context": "An earth-being in Nahua creation accounts.",
}
SUMMARY_FIELDS = {"name", "english", "position", "description"}


class SchemaQuery:
    """Reject unknown columns as PostgREST does, and project selected fields."""

    def __init__(self, rows: list[dict]) -> None:
        self.rows = rows
        self.columns: list[str] = []

    def table(self, table: str):
        if table != "day_signs":
            raise ValueError("Unknown table")
        return self

    def select(self, columns: str):
        self.columns = columns.split(",")
        if not set(self.columns) <= ROW.keys():
            raise ValueError("Unknown column in day_signs selection")
        return self

    def order(self, column: str):
        self.rows = sorted(self.rows, key=lambda row: row[column])
        return self

    def eq(self, column: str, value: str):
        self.rows = [row for row in self.rows if row[column] == value]
        return self

    def limit(self, limit: int):
        self.rows = self.rows[:limit]
        return self

    def execute(self):
        return SimpleNamespace(data=[
            {column: row[column] for column in self.columns} for row in self.rows
        ])


class DaySignTests(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = patch.object(day_signs, "_client", side_effect=lambda: SchemaQuery([ROW]))
        self.repository.start()
        self.addCleanup(self.repository.stop)
        self.client = TestClient(app)

    def test_summary_service_retains_description_without_deeper_sections(self) -> None:
        summary = get_day_sign("Cipactli")
        self.assertEqual(set(summary.model_dump()), SUMMARY_FIELDS)
        self.assertEqual(summary.description, ROW["description"])
        self.assertEqual(list_day_signs(), [summary])

    def test_detail_service_reads_only_existing_columns(self) -> None:
        detail = get_day_sign("Cipactli", include_sections=True)
        self.assertEqual(detail.model_dump(), ROW)
        self.assertEqual(set(day_signs.DETAIL_COLUMNS.split(",")), set(ROW))

    def test_summary_endpoints_include_description(self) -> None:
        for path in ("/day-signs", "/day-signs/Cipactli"):
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 200)
                payload = response.json()
                summary = payload[0] if isinstance(payload, list) else payload
                self.assertEqual(set(summary), SUMMARY_FIELDS)
                self.assertEqual(summary["description"], ROW["description"])

    def test_detail_endpoint_exposes_exact_seven_column_contract(self) -> None:
        response = self.client.get("/day-signs/Cipactli/detail")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), ROW)

    def test_calendar_endpoint_includes_the_sign_description(self) -> None:
        veintena = {
            "position": 1, "name": "Atlacahualo", "span": "March 12–31",
            "span_es": "12–31 de marzo", "meaning_es": "Lo dejado por las aguas",
            "meaning_en": "What is left by the water", "correlation": "test", "source": "test",
        }
        with patch("app.main.get_veintena", return_value=veintena):
            response = self.client.get("/calendar/2022-03-12")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["day_sign"], {key: ROW[key] for key in SUMMARY_FIELDS})

    def test_missing_sign_returns_404(self) -> None:
        for path in ("/day-signs/Unknown", "/day-signs/Unknown/detail"):
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 404)

    def test_null_description_and_sections_remain_nullable(self) -> None:
        row = {key: value if key in {"name", "english", "position"} else None for key, value in ROW.items()}
        with patch.object(day_signs, "_client", side_effect=lambda: SchemaQuery([row])):
            response = self.client.get("/day-signs/Cipactli/detail")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), row)

    def test_database_failures_return_service_unavailable(self) -> None:
        with patch.object(day_signs, "_client", side_effect=RuntimeError("private database failure")):
            response = self.client.get("/day-signs/Cipactli/detail")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {"detail": "Could not read day sign from Supabase"})


if __name__ == "__main__":
    unittest.main()
