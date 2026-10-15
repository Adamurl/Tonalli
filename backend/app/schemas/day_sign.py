"""Typed API representations of day signs."""

from pydantic import BaseModel, ConfigDict


class DaySignSummary(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str
    english: str
    position: int


class DaySignDetail(DaySignSummary):
    quick_reference: str | None = None
    literal_meaning_and_glyph: str | None = None
    core_meanings_and_symbolism: str | None = None
    cultural_and_historical_context: str | None = None
    day_sign_deity_association: str | None = None
    app_safe_description: str | None = None
    editorial_cautions: str | None = None
    sources: str | None = None
