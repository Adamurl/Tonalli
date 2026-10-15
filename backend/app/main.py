from datetime import date
import re

from fastapi import FastAPI, HTTPException

from app.api.routes.day_signs import router as day_signs_router
from app.calendar_conversion import (
    calculate_tonalpohualli,
    calculate_xihuitl,
    calculate_xiuhpohualli,
    gregorian_to_jdn,
)
from app.services.day_signs import DaySignServiceError, get_day_sign

app = FastAPI(title="Aztec Calendar API")
app.include_router(day_signs_router)

# Initial implementation uses the Alfonso Caso correlation; alternative historical
# correlation systems may be added later.
CORRELATION = "alfonso_caso"


@app.get("/")
def root() -> dict:
    return {"message": "Aztec Calendar API", "status": "ok"}


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
    except DaySignServiceError as exc:
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
