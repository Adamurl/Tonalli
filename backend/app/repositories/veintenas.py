"""Read the workbook's veintena reference table from Supabase."""

from app.repositories.day_signs import _client

TABLE = "veintenas"
COLUMNS = "position,name,span,span_es,meaning_es,meaning_en,correlation,source"


class VeintenaRepositoryError(RuntimeError):
    """Raised when veintena reference data cannot be read."""


def list_veintenas() -> list[dict]:
    try:
        response = _client().table(TABLE).select(COLUMNS).order("position").execute()
        return response.data
    except Exception as exc:
        if isinstance(exc, VeintenaRepositoryError):
            raise
        raise VeintenaRepositoryError("Could not read veintenas from Supabase") from exc


def get_veintena(position: int) -> dict | None:
    try:
        response = (
            _client()
            .table(TABLE)
            .select(COLUMNS)
            .eq("position", position)
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception as exc:
        if isinstance(exc, VeintenaRepositoryError):
            raise
        raise VeintenaRepositoryError("Could not read veintena from Supabase") from exc
