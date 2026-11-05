# Day-sign database backups

Each timestamped CSV contains the twenty live rows read before an editorial update attempt. All seven columns are included. Files use UTF-8, and CSV quoting preserves embedded newlines and punctuation. The companion manifests record SHA-256 checksums and null handling.

Git preserves CSV bytes without line-ending conversion so the recorded checksums remain valid. CSV record endings can use CRLF.

The initial 2026-11-05T044221Z attempt was blocked by row-level security. No data changed during that attempt.

After user approval and CLI authentication, the update succeeded. The fresh pre-update backup is `day_signs-before-editorial-update-2026-11-05T044938Z.csv`. Its manifest records successful application and read-back verification. All twenty records and eighty content fields matched `../records.json`. Names, English labels, positions, schema, and permissions were preserved.

The CLI applied the content in one transaction. It locked the table against concurrent writes and checked the live rows against the fresh backup before updating the four content columns. The public API and application services then returned the new descriptions.

The prepared replacement CSV is `../day_signs-editorial.csv`. The repeatable SQL is `../../../backend/sql/day_sign_content.sql`. The canonical editable content remains `../records.json`.

The later column rename has a separate pre-rename backup, `day_signs-before-column-rename-2026-11-05T045902Z.csv`. Its manifest contains the old-to-new column mapping and successful verification. Every content value was preserved. Historical CSVs retain their original headers; the current records and import CSV use `description`, `meaning_and_glyph`, `symbolism`, and `cultural_context`.
