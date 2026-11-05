# Day-sign website content

This package prepares all twenty signs for the main calendar page and a future individual sign page. The display copy describes each sign's imagery, symbolism, and cultural setting. It combines the retained English translations and existing editorial material. It does not assign a personality or a prediction to the selected date.

## Files

- `records.json` is the editable source for the twenty website records.
- `preview.md` is the generated reading copy, organized by sign and page section.
- `provenance.json` retains source locators and editorial decisions outside the display copy.
- `../../backend/sql/day_sign_content.sql` is the generated transactional content update.

The original translations remain in `../calendar/` and `../../books/ENGLISH_TRANSLATIONS_AND_SYMBOL_REFERENCE.md`. Edit the website records rather than those translations.

## Database and page contract

The day-sign table has twenty rows and seven columns. Four content columns have clearer names, shared by the database, API, frontend, editable records, and current import CSV. Original source files and historical CSV backups retain their original names.

| Column | Website use | Previous name |
| --- | --- | --- |
| `name` | Canonical Nahuatl name and existing lookup key | Unchanged. |
| `english` | Existing navigation label | Unchanged. |
| `position` | Position in the twenty-sign sequence | Unchanged. |
| `description` | The substantial day-sign paragraph on the main date page | `app_safe_description` |
| `meaning_and_glyph` | Name and glyph section on the deeper page | `literal_meaning_and_glyph` |
| `symbolism` | Meaning and symbolism section on the deeper page | `core_meanings_and_symbolism` |
| `cultural_context` | Stories and cultural context section on the deeper page | `cultural_and_historical_context` |

No additional column is required for these four content areas. An `overview` column would duplicate `description`. A JSON sections column would duplicate the three fixed detail fields. Reconsider a separate sections table when editors need different section sets, individual publication controls, or independent ordering for each sign.

Remove `quick_reference`, `day_sign_deity_association`, `editorial_cautions`, and `sources` from application selects and response contracts. These columns were absent from all returned rows. Do not recreate them as part of this content import. Provenance belongs in the editorial package for now. Conflicting patron assignments require source-specific records before a dedicated public patron field is useful.

The summary API exposes `name`, `english`, `position`, and nullable `description`. The detail API adds nullable `meaning_and_glyph`, `symbolism`, and `cultural_context`. The calendar response embeds the summary so changing the selected date changes the displayed sign paragraph. The frontend displays plain text. Source locators and editorial cautions are not part of that paragraph.

`backend/sql/rename_day_sign_content_columns.sql` renames the four columns in place in one transaction. It preserves their values and requests a REST schema-cache refresh. A second run keeps the new names. Ambiguous or missing column pairs abort the transaction. Current clients must use the new names; no duplicate legacy fields are returned.

The rename was applied and verified on November 5, 2026 UTC. All twenty live rows and eighty content fields were identical to the pre-rename backup after mapping the four keys. The main page reads `calendar.day_sign.description`. The original-column CSV and migration manifest are in `backups/`, with timestamp `2026-11-05T045902Z`.

## Editorial choices

Main-page paragraphs describe the sign itself. Number meanings and complete date readings need separate content. Particular dates such as Nahui Ollin are identified as number-and-sign combinations when discussed in deeper context.

The new translated entries cover all twenty signs. The earlier reference contains thirteen complete entries, partial Mazatl and Acatl entries, and no individual entries for Tochtli, Atl, Itzcuintli, Ozomahtli, or Malinalli. The provenance file preserves those differences. Missing earlier passages have not been reconstructed.

Display copy omits speculative biological explanations, unsupported etymologies, and deterministic birth readings. It also omits unresolved patron assignments. The navigation label Ocelotl remains Jaguar while provenance preserves the translated text's different animal identification.

## Generate and check

Run these commands from the repository root:

```sh
python3 backend/scripts/prepare_day_sign_content.py
python3 backend/scripts/prepare_day_sign_content.py --check
```

The generator verifies all twenty identities against the calendar's existing sequence, requires all eighty content fields, and rejects display citation markers. It generates a reading copy and SQL from the same records. Neither command connects to Supabase.

The generated SQL updates only the four content columns. Each update must match exactly one existing row by name, position, and English label. A missing or duplicate match aborts the transaction. The script does not insert or delete signs, change schema, or alter permissions.

The editorial content was applied to Tonalli on November 5, 2026 UTC, after user approval. All twenty live records and eighty content fields were read back and matched `records.json` exactly. Names, English labels, positions, schema, and permissions were preserved. The pre-update CSV and publication manifest are in `backups/`, with timestamp `2026-11-05T044938Z`. This work prepares the individual-page data; it does not create a new individual-page route.

Run backend checks from the repository root:

```sh
PYTHONPATH=backend python3 -m unittest discover -s backend/tests -v
```

The import tests require local `initdb`, `pg_ctl`, and `psql` executables. They create a private temporary PostgreSQL cluster with no TCP listener. They verify all twenty records, a repeated import, and complete rollback for missing or duplicate identity matches. They never connect to Supabase. The Codex sandbox blocked PostgreSQL shared memory; the same import tests passed with a scoped execution approval.

## Interrogate review

Two independent reviewers used the live-row snapshot and executable probes against the application. Both recommended the existing seven-column structure.

| Verified issue | Evidence | Resolution |
| --- | --- | --- |
| Detail queries selected deleted columns. | Comparing `DETAIL_COLUMNS` with every live row identified the same four absent columns listed above. | Reconcile the explicit select and detail schema. |
| Main-page responses discarded the description. | Validating a live row through the original `DaySignSummary` returned only name, English label, and position. | Include the description in the summary query and response. |
| Existing text includes display attribution. | Eight symbolism fields contain `[S…]` citation markers. Further records mention authors or historical sources in their display copy. | Prepare clean editorial copy while retaining separate provenance. |
| Ollin lacked one deeper section. | Its live `cultural_and_historical_context` value was an empty string. | Supply a complete draft section. |

One reviewer dropped two unsupported concerns: JSONB being inherently unsafe, and fixed columns being insufficient for future expansion. The other reported no dropped concerns. Those claims do not justify a schema change for this task. The reviewer models were GPT-6.1 Sol and GPT-6.1 Terra; this was a same-provider review.

A final independent Terra review inspected all eighty display fields and the implemented contracts. It reported no verified actionable findings. Its content-generator check and fifteen content and API tests passed. It spot-checked source-sensitive claims against the retained translations; this was not independent historical or linguistic verification.
