"""Read day sign reference data from Supabase."""

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

TABLE = "day_signs"
BASE_COLUMNS = "name,english,position"
DETAIL_FIELDS = (
    "quick_reference",
    "literal_meaning_and_glyph",
    "core_meanings_and_symbolism",
    "cultural_and_historical_context",
    "day_sign_deity_association",
    "app_safe_description",
    "editorial_cautions",
    "sources",
)
DETAIL_COLUMNS = f"{BASE_COLUMNS},{','.join(DETAIL_FIELDS)}"


class DaySignRepositoryError(RuntimeError):
    """Raised when day sign data cannot be read from Supabase."""


@lru_cache(maxsize=1)
def _client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    if not url or not key:
        raise DaySignRepositoryError("Supabase is not configured")
    try:
        return create_client(url, key)
    except Exception as exc:
        raise DaySignRepositoryError("Could not initialize Supabase") from exc


def list_day_signs() -> list[dict]:
    try:
        response = _client().table(TABLE).select(BASE_COLUMNS).order("position").execute()
        return response.data
    except DaySignRepositoryError:
        raise
    except Exception as exc:
        raise DaySignRepositoryError("Could not read day signs from Supabase") from exc


def get_day_sign(name: str, *, include_sections: bool = False) -> dict | None:
    try:
        columns = DETAIL_COLUMNS if include_sections else BASE_COLUMNS
        response = (
            _client()
            .table(TABLE)
            .select(columns)
            .eq("name", name)
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None
    except DaySignRepositoryError:
        raise
    except Exception as exc:
        raise DaySignRepositoryError("Could not read day sign from Supabase") from exc
