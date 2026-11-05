"""Typed API representations of day signs."""

from pydantic import BaseModel, ConfigDict


class DaySignSummary(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str
    english: str
    position: int
    description: str | None = None


class DaySignDetail(DaySignSummary):
    meaning_and_glyph: str | None = None
    symbolism: str | None = None
    cultural_context: str | None = None
