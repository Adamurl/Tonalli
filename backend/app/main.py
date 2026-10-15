from datetime import date
import re

from fastapi import FastAPI, HTTPException

from app.day_signs import DaySignStoreError, get_day_sign, list_day_signs
from app.calendar_conversion import (
    calculate_tonalpohualli,
    calculate_xihuitl,
    calculate_xiuhpohualli,
    gregorian_to_jdn,
)

app = FastAPI(title="Aztec Calendar API")

# Initial implementation uses the Alfonso Caso correlation; alternative historical
# correlation systems may be added later.
CORRELATION = "alfonso_caso"


@app.get("/")
def root() -> dict:
    return {"message": "Aztec Calendar API", "status": "ok"}


@app.get("/day-signs")
def day_signs() -> list[dict]:
    try:
        return list_day_signs()
    except DaySignStoreError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None


@app.get("/day-signs/{name}/detail")
def day_sign_detail(name: str) -> dict:
    try:
        result = get_day_sign(name, include_sections=True)
    except DaySignStoreError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None
    if result is None:
        raise HTTPException(status_code=404, detail="Day sign not found")
    return result


@app.get("/day-signs/{name}")
def day_sign(name: str) -> dict:
    try:
        result = get_day_sign(name)
    except DaySignStoreError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None
    if result is None:
        raise HTTPException(status_code=404, detail="Day sign not found")
    return result


@app.get("/calendar/{date_string}")
def calendar_for_date(date_string: str) -> dict:
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_string):
        raise HTTPException(status_code=400, detail="Date must use YYYY-MM-DD format")
    try:
        parsed_date = date.fromisoformat(date_string)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid calendar date") from None

    jdn = gregorian_to_jdn(parsed_date.year, parsed_date.month, parsed_date.day)
    tonalpohualli = calculate_tonalpohualli(jdn)
    try:
        day_sign_info = get_day_sign(tonalpohualli["sign"])
    except DaySignStoreError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None
    if day_sign_info is None:
        raise HTTPException(status_code=503, detail="Day sign data is missing")

    return {
        "date": parsed_date.isoformat(),
        "correlation": CORRELATION,
        "tonalpohualli": tonalpohualli,
        "day_sign": day_sign_info,
        "xiuhpohualli": calculate_xiuhpohualli(jdn),
        "xihuitl": calculate_xihuitl(jdn),
    }
