import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

from scripts.prepare_day_sign_content import BACKEND, CONTENT_DIR, load_records, render_sql


COLUMN_RENAMES = {
    "app_safe_description": "description",
    "literal_meaning_and_glyph": "meaning_and_glyph",
    "core_meanings_and_symbolism": "symbolism",
    "cultural_and_historical_context": "cultural_context",
}
RENAME_SQL = (BACKEND / "sql" / "rename_day_sign_content_columns.sql").read_text()


@unittest.skipUnless(
    all(shutil.which(command) for command in ("initdb", "pg_ctl", "psql")),
    "Local PostgreSQL executables are not installed",
)
class DaySignImportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.directory = tempfile.TemporaryDirectory(prefix="tonalli-content-pg-")
        cls.addClassCleanup(cls.directory.cleanup)
        cls.path = Path(cls.directory.name)
        cls.data = cls.path / "data"
        cls.run_command([
            "initdb", "-D", str(cls.data), "-A", "trust", "-U", "tonalli_test",
            "--no-locale", "--encoding=UTF8",
        ])
        cls.run_command([
            "pg_ctl", "-D", str(cls.data), "-l", str(cls.path / "server.log"),
            "-o", f"-F -k {cls.path} -h '' -p 55439", "-w", "start",
        ])
        cls.addClassCleanup(cls.run_command, ["pg_ctl", "-D", str(cls.data), "-m", "immediate", "-w", "stop"])
        cls.records = load_records(CONTENT_DIR / "records.json")

    @staticmethod
    def run_command(command: list[str]) -> subprocess.CompletedProcess:
        result = subprocess.run(command, text=True, capture_output=True, timeout=30)
        if result.returncode:
            raise RuntimeError(result.stdout + result.stderr)
        return result

    @classmethod
    def execute(cls, sql: str, *, succeeds: bool = True) -> str:
        result = subprocess.run(
            ["psql", "-X", "-h", str(cls.path), "-p", "55439", "-U", "tonalli_test",
             "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-A", "-t", "-q"],
            input=sql, text=True, capture_output=True, timeout=30,
        )
        if succeeds and result.returncode:
            raise AssertionError(result.stderr)
        if not succeeds and not result.returncode:
            raise AssertionError("Import unexpectedly succeeded")
        return result.stdout.strip() if succeeds else result.stderr

    def setUp(self) -> None:
        self.execute("""
            drop table if exists public.day_signs;
            create table public.day_signs (
                name text, english text, position integer,
                description text, meaning_and_glyph text,
                symbolism text, cultural_context text
            );
        """)
        seed = [
            {key: row[key] if key in {"name", "english", "position"} else "original"
             for key in row}
            for row in self.records
        ]
        payload = json.dumps(seed)
        self.execute(f"""
            truncate public.day_signs;
            insert into public.day_signs select * from jsonb_populate_recordset(
                null::public.day_signs, $seed${payload}$seed$::jsonb
            );
        """)

    def read_rows(self) -> list[dict]:
        return json.loads(self.execute("""
            select json_agg(row_to_json(d) order by position)
            from public.day_signs d;
        """))

    def test_import_round_trips_all_content_and_is_repeatable(self) -> None:
        sql = render_sql(self.records)
        self.execute(sql)
        self.assertEqual(self.read_rows(), self.records)
        self.execute(sql)
        self.assertEqual(self.read_rows(), self.records)

    def test_column_rename_preserves_all_content_and_is_repeatable(self) -> None:
        self.execute(render_sql(self.records))
        self.execute("update public.day_signs set description = null where position = 1;")
        expected = self.read_rows()
        for old, new in COLUMN_RENAMES.items():
            self.execute(f"alter table public.day_signs rename column {new} to {old};")
        old_rows = self.read_rows()
        self.assertEqual(
            [{COLUMN_RENAMES.get(key, key): value for key, value in row.items()}
             for row in old_rows],
            expected,
        )
        self.execute(RENAME_SQL)
        self.assertEqual(self.read_rows(), expected)
        self.execute(RENAME_SQL)
        self.assertEqual(self.read_rows(), expected)

    def test_ambiguous_column_pair_rolls_back_prior_renames(self) -> None:
        self.execute("""
            alter table public.day_signs rename column description to app_safe_description;
            alter table public.day_signs add column cultural_and_historical_context text;
        """)
        before = self.read_rows()
        error = self.execute(RENAME_SQL, succeeds=False)
        self.assertIn("Expected exactly one of day_signs.cultural_and_historical_context", error)
        self.assertEqual(self.read_rows(), before)

    def test_missing_column_pair_rolls_back_prior_renames(self) -> None:
        self.execute("""
            alter table public.day_signs rename column description to app_safe_description;
            alter table public.day_signs drop column cultural_context;
        """)
        before = self.read_rows()
        error = self.execute(RENAME_SQL, succeeds=False)
        self.assertIn("Expected exactly one of day_signs.cultural_and_historical_context", error)
        self.assertEqual(self.read_rows(), before)

    def test_missing_identity_rolls_back_every_content_update(self) -> None:
        self.execute("delete from public.day_signs where position = 20;")
        before = self.read_rows()
        error = self.execute(render_sql(self.records), succeeds=False)
        self.assertIn("Expected one matching row for Xochitl, found 0", error)
        self.assertEqual(self.read_rows(), before)

    def test_duplicate_identity_rolls_back_every_content_update(self) -> None:
        self.execute("insert into public.day_signs select * from public.day_signs where position = 20;")
        before = self.read_rows()
        error = self.execute(render_sql(self.records), succeeds=False)
        self.assertIn("Expected one matching row for Xochitl, found 2", error)
        self.assertEqual(self.read_rows(), before)


if __name__ == "__main__":
    unittest.main()
