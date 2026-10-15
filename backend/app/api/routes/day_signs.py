"""Day sign HTTP endpoints."""

from fastapi import APIRouter, HTTPException

from app.schemas.day_sign import DaySignDetail, DaySignSummary
from app.services.day_signs import DaySignServiceError, get_day_sign, list_day_signs

router = APIRouter(prefix="/day-signs", tags=["day signs"])


@router.get("", response_model=list[DaySignSummary])
def day_sign_list() -> list[DaySignSummary]:
    try:
        return list_day_signs()
    except DaySignServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None


@router.get("/{name}/detail", response_model=DaySignDetail)
def day_sign_detail(name: str) -> DaySignDetail:
    try:
        result = get_day_sign(name, include_sections=True)
    except DaySignServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None
    if result is None:
        raise HTTPException(status_code=404, detail="Day sign not found")
    return result


@router.get("/{name}", response_model=DaySignSummary)
def day_sign(name: str) -> DaySignSummary:
    try:
        result = get_day_sign(name)
    except DaySignServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None
    if result is None:
        raise HTTPException(status_code=404, detail="Day sign not found")
    return result
