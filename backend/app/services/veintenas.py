"""Veintena reference behavior."""

from app.repositories.veintenas import (
    VeintenaRepositoryError,
    get_veintena as get_veintena_record,
    list_veintenas as list_veintena_records,
)
from app.schemas.calendar import VeintenaReference


class VeintenaServiceError(RuntimeError):
    """Raised when veintena reference data cannot be provided."""


def list_veintenas() -> list[VeintenaReference]:
    try:
        return [VeintenaReference.model_validate(row) for row in list_veintena_records()]
    except VeintenaRepositoryError as exc:
        raise VeintenaServiceError(str(exc)) from exc


def get_veintena(position: int) -> VeintenaReference | None:
    try:
        row = get_veintena_record(position)
    except VeintenaRepositoryError as exc:
        raise VeintenaServiceError(str(exc)) from exc
    return VeintenaReference.model_validate(row) if row else None
