# Tonalli

Tonalli is a simple Mexica calendar app that converts a Gregorian date into its
corresponding Mexica calendar information using the Alfonso Caso correlation.

## Project layout

- `backend/app/api/routes/` contains the HTTP endpoints.
- `backend/app/services/` contains application behavior.
- `backend/app/repositories/` reads reference data from Supabase.
- `backend/app/schemas/` defines typed Pydantic API responses.
- `backend/app/calendar_conversion.py` contains calendar conversion logic.
- `backend/requirements.txt` lists the backend dependencies.
- `frontend/` is reserved for the future frontend.

## Run the API

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open <http://127.0.0.1:8000/docs> for the interactive API documentation.
