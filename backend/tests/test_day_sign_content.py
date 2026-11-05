import copy
import json
from pathlib import Path
import tempfile
import unittest

from scripts.prepare_day_sign_content import CONTENT_DIR, CONTENT_FIELDS, ROOT, load_records, render_sql


class DaySignContentTests(unittest.TestCase):
    def setUp(self) -> None:
        self.records = json.loads((CONTENT_DIR / "records.json").read_text())

    def validate(self, records: list[dict]) -> list[dict]:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "records.json"
            path.write_text(json.dumps(records))
            return load_records(path)

    def test_complete_editorial_package(self) -> None:
        self.assertEqual(len(self.validate(self.records)), 20)

    def test_every_display_field_has_resolvable_local_provenance(self) -> None:
        provenance = json.loads((CONTENT_DIR / "provenance.json").read_text())["records"]
        self.assertEqual(set(provenance), {row["name"].lower() for row in self.records})
        for row in self.records:
            with self.subTest(sign=row["name"]):
                notes = provenance[row["name"].lower()]
                self.assertEqual(set(notes["section_support"]), set(CONTENT_FIELDS))
                for key in ("name", "english", "position"):
                    self.assertEqual(notes[key], row[key])
                for source in notes["local_source_paths"]:
                    self.assertTrue((ROOT / source).is_file(), source)

    def test_missing_sign_is_rejected(self) -> None:
        with self.assertRaisesRegex(ValueError, "exactly twenty"):
            self.validate(self.records[:-1])

    def test_duplicate_sign_cannot_replace_another(self) -> None:
        self.records[1] = copy.deepcopy(self.records[0])
        with self.assertRaisesRegex(ValueError, "calendar identity"):
            self.validate(self.records)

    def test_unknown_column_cannot_enter_import(self) -> None:
        self.records[0]["sources"] = "An obsolete column"
        with self.assertRaisesRegex(ValueError, "seven-column"):
            self.validate(self.records)

    def test_empty_detail_section_is_rejected(self) -> None:
        self.records[16]["cultural_context"] = ""
        with self.assertRaisesRegex(ValueError, "complete description"):
            self.validate(self.records)

    def test_citation_markers_cannot_enter_display_copy(self) -> None:
        self.records[0]["symbolism"] += " [S8]"
        with self.assertRaisesRegex(ValueError, "display attribution"):
            self.validate(self.records)

    def test_sql_delimiters_cannot_terminate_payload_or_block(self) -> None:
        for delimiter in ("$tonalli_content$", "$tonalli_update$"):
            with self.subTest(delimiter=delimiter):
                records = copy.deepcopy(self.records)
                records[0]["description"] += delimiter
                with self.assertRaisesRegex(ValueError, "SQL payload delimiter"):
                    render_sql(records)


if __name__ == "__main__":
    unittest.main()
