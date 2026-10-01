from datetime import date
import re

from fastapi import FastAPI, HTTPException

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


@app.get("/calendar/{date_string}")
def calendar_for_date(date_string: str) -> dict:
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_string):
        raise HTTPException(status_code=400, detail="Date must use YYYY-MM-DD format")
    try:
        parsed_date = date.fromisoformat(date_string)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid calendar date") from None

    jdn = gregorian_to_jdn(parsed_date.year, parsed_date.month, parsed_date.day)
    return {
        "date": parsed_date.isoformat(),
        "correlation": CORRELATION,
        "tonalpohualli": calculate_tonalpohualli(jdn),
        "xiuhpohualli": calculate_xiuhpohualli(jdn),
        "xihuitl": calculate_xihuitl(jdn),
    }
