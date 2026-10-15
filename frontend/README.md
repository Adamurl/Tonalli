# Frontend

The calendar home screen is a small Next.js app that reads date data from the
FastAPI backend.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Start the backend separately from `backend/` with `uvicorn app.main:app --reload`.
The frontend proxies `/api/calendar/{date}` to `BACKEND_API_URL`, which defaults
to `http://127.0.0.1:8000`.

## Glyph artwork

Add exported day-sign glyphs to `assets/` and map each exact API sign name to its
file in `components/SignGlyph.tsx`. Until a glyph is available, the page shows a
placeholder.
