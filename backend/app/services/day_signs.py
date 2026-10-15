"""Day sign application behavior."""

from app.repositories.day_signs import (
    DaySignRepositoryError,
    get_day_sign as get_day_sign_record,
    list_day_signs as list_day_sign_records,
)
from app.schemas.day_sign import DaySignDetail, DaySignSummary


class DaySignServiceError(RuntimeError):
    """Raised when day sign data cannot be provided."""


def list_day_signs() -> list[DaySignSummary]:
    try:
        return [DaySignSummary.model_validate(row) for row in list_day_sign_records()]
    except DaySignRepositoryError as exc:
        raise DaySignServiceError(str(exc)) from exc


def get_day_sign(name: str, *, include_sections: bool = False) -> DaySignSummary | DaySignDetail | None:
    try:
        row = get_day_sign_record(name, include_sections=include_sections)
    except DaySignRepositoryError as exc:
        raise DaySignServiceError(str(exc)) from exc
    if row is None:
        return None
    schema = DaySignDetail if include_sections else DaySignSummary
    return schema.model_validate(row)
