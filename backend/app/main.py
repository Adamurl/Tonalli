from datetime import date
import re

from fastapi import FastAPI, HTTPException

from app.api.routes.day_signs import router as day_signs_router
from app.calendar_conversion import (
    calendar_position_for_date,
    calculate_tonalpohualli,
    calculate_trecena,
    calculate_xihuitl,
    calculate_xiuhpohualli,
    VEINTENAS,
)
from app.schemas.calendar import CalendarDate, VeintenaReference
from app.services.day_signs import DaySignServiceError, get_day_sign
from app.services.veintenas import (
    VeintenaServiceError,
    get_veintena,
    list_veintenas,
)

app = FastAPI(title="Aztec Calendar API")
app.include_router(day_signs_router)

# This identifies the user-provided workbook anchor and its Mexico City convention.
CORRELATION = "workbook_2022_mexico_city"


@app.get("/")
def root() -> dict:
    return {"message": "Aztec Calendar API", "status": "ok"}


@app.get("/calendar/reference/veintenas", response_model=list[VeintenaReference])
def veintena_reference() -> list[VeintenaReference]:
    """Return the workbook's 18 veintenas and Nemontemi reference entries."""
    try:
        return list_veintenas()
    except VeintenaServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None


@app.get("/calendar/{date_string}", response_model=CalendarDate)
def calendar_for_date(date_string: str) -> CalendarDate:
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_string):
        raise HTTPException(status_code=400, detail="Date must use YYYY-MM-DD format")
    try:
        parsed_date = date.fromisoformat(date_string)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid calendar date") from None

    position = calendar_position_for_date(parsed_date)
    tonalpohualli = calculate_tonalpohualli(position.day_index, position.year_offset)
    try:
        day_sign_info = get_day_sign(tonalpohualli["sign"])
    except DaySignServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None
    if day_sign_info is None:
        raise HTTPException(status_code=503, detail="Day sign data is missing")

    xiuhpohualli = calculate_xiuhpohualli(position.day_index)
    veintena_position = VEINTENAS.index(xiuhpohualli["veintena"]) + 1
    try:
        veintena_info = get_veintena(veintena_position)
    except VeintenaServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None
    if veintena_info is None:
        raise HTTPException(status_code=503, detail="Veintena reference data is missing")

    return {
        "date": parsed_date.isoformat(),
        "correlation": CORRELATION,
        "tonalpohualli": tonalpohualli,
        "day_sign": day_sign_info,
        "trecena": calculate_trecena(position.day_index, position.year_offset),
        "xiuhpohualli": {
            **xiuhpohualli,
            "position": veintena_position,
            "reference": veintena_info,
        },
        "xihuitl": calculate_xihuitl(position),
    }
