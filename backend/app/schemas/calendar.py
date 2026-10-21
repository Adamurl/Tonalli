"""Typed API representation of calendar dates."""

from datetime import date

from pydantic import BaseModel

from app.schemas.day_sign import DaySignSummary


class TonalpohualliDate(BaseModel):
    number: int
    sign: str
    english: str


class Trecena(BaseModel):
    number: int
    sign: str
    english: str


class VeintenaReference(BaseModel):
    position: int
    name: str
    span: str
    span_es: str
    meaning_es: str
    meaning_en: str
    correlation: str
    source: str


class XiuhpohualliDate(BaseModel):
    veintena: str
    day: int
    position: int
    reference: VeintenaReference


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
