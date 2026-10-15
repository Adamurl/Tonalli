"""Typed API representation of calendar dates."""

from datetime import date

from pydantic import BaseModel

from app.schemas.day_sign import DaySignSummary


class TonalpohualliDate(BaseModel):
    number: int
    sign: str
    english: str


class Trecena(BaseModel):
    sign: str
    english: str


class XiuhpohualliDate(BaseModel):
    veintena: str
    day: int


class XihuitlYear(BaseModel):
    number: int
    sign: str


class CalendarDate(BaseModel):
    date: date
    correlation: str
    tonalpohualli: TonalpohualliDate
    day_sign: DaySignSummary
    trecena: Trecena
    xiuhpohualli: XiuhpohualliDate
    xihuitl: XihuitlYear
