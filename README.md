# Tonalli

Tonalli converts Gregorian dates using a workbook-based Mexico City correlation.
Its current anchor is March 12, 2022 at 6:43 a.m. Mexico City time: 10 Tochtli,
4 Cipactli, day 1 of Atlacahualo.

## Project layout

- `backend/app/api/routes/` contains the HTTP endpoints.
- `backend/app/services/` contains application behavior.
- `backend/app/repositories/` reads reference data from Supabase.
- `backend/app/schemas/` defines typed Pydantic API responses.
- `backend/app/calendar_conversion.py` contains calendar conversion logic.
- `backend/sql/veintenas.sql` creates and seeds the public veintena reference table.
- `backend/requirements.txt` lists the backend dependencies.
- `frontend/` contains the Next.js calendar home screen and glyph assets.

## Run the API

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open <http://127.0.0.1:8000/docs> for the interactive API documentation.

## Supabase reference data

Run `backend/sql/veintenas.sql` in the Supabase SQL Editor to create and seed the
`public.veintenas` table. It contains the 18 veintenas, Nemontemi, the wording
from the workbook, and the workbook's reference Gregorian spans. The table is
readable through the Data API and has row-level security enabled for public
read-only access. The API exposes the rows at `/calendar/reference/veintenas`
and embeds the matching row in each calendar response.

The day-sign and number matrix restarts at Cipactli on each workbook year start.
The supplied 2017–2022 year matrices show the opening number stepping back by
four each year (11, 7, 3, 12, 8, 4). The 365.25-day boundary advances six hours
per year. Gregorian spans in the reference table therefore describe the
workbook's displayed correlation and should not be treated as fixed annual
dates for other correlations or communities.

The dated 10 Tochtli sheet separately records the preceding 9 Calli Nemontemi
days as 2 Cozcacuauhtli through 6 Xochitl. That year-end sequence and the
10 Tochtli Nemontemi matrix are encoded as explicit workbook cases; other
Nemontemi years follow the annual matrix rule.

## Run the frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Run the API in a separate terminal; the frontend expects it at
<http://127.0.0.1:8000> by default.
