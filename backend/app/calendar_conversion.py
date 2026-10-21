"""Date conversion for the workbook's Mexico City calendar correlation."""

from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

DAY_SIGNS = [
    {"nahuatl": "Cipactli", "english": "Crocodile"},
    {"nahuatl": "Ehecatl", "english": "Wind"},
    {"nahuatl": "Calli", "english": "House"},
    {"nahuatl": "Cuetzpalin", "english": "Lizard"},
    {"nahuatl": "Coatl", "english": "Serpent"},
    {"nahuatl": "Miquiztli", "english": "Death"},
    {"nahuatl": "Mazatl", "english": "Deer"},
    {"nahuatl": "Tochtli", "english": "Rabbit"},
    {"nahuatl": "Atl", "english": "Water"},
    {"nahuatl": "Itzcuintli", "english": "Dog"},
    {"nahuatl": "Ozomahtli", "english": "Monkey"},
    {"nahuatl": "Malinalli", "english": "Grass"},
    {"nahuatl": "Acatl", "english": "Reed"},
    {"nahuatl": "Ocelotl", "english": "Jaguar"},
    {"nahuatl": "Cuauhtli", "english": "Eagle"},
    {"nahuatl": "Cozcacuauhtli", "english": "Vulture"},
    {"nahuatl": "Ollin", "english": "Movement"},
    {"nahuatl": "Tecpatl", "english": "Flint"},
    {"nahuatl": "Quiahuitl", "english": "Rain"},
    {"nahuatl": "Xochitl", "english": "Flower"},
]

YEAR_SIGNS = ["Calli", "Tochtli", "Acatl", "Tecpatl"]

# The workbook's 18 veintenas, followed by the five Nemontemi days.
VEINTENAS = [
    "Atlacahualo",
    "Tlacaxipehualiztli",
    "Tezoztontli",
    "Hueytozoztli",
    "Toxcatl",
    "Etzalcualiztli",
    "Tecuilhuitontli",
    "Huey Tecuilhuitl",
    "Tlaxochimaco",
    "Xocotl Huetzi",
    "Ochpaniztli",
    "Teotleco",
    "Tepeilhuitl",
    "Quecholli",
    "Panquetzaliztli",
    "Atemoztli",
    "Tititl",
    "Izcalli",
    "Nemontemi",
]

MEXICO_CITY = ZoneInfo("America/Mexico_City")
YEAR_LENGTH = timedelta(hours=8_766)  # 365.25 days
ANCHOR_LOCAL = datetime(2022, 3, 12, 6, 43, tzinfo=MEXICO_CITY)
ANCHOR_UTC = ANCHOR_LOCAL.astimezone(timezone.utc)
ANCHOR_DATE = ANCHOR_LOCAL.date()
ANCHOR_XIHUITL_NUMBER = 10
ANCHOR_YEAR_SIGN_INDEX = YEAR_SIGNS.index("Tochtli")
ANCHOR_TONALLI_NUMBER = 4
ANCHOR_DAY_SIGN_INDEX = 0  # Cipactli
# The workbook keeps Nemontemi as a separate five-day sequence. These two
# displayed cases are explicit: 9 Calli's ending days in the dated 10 Tochtli
# sheet, and 10 Tochtli's Nemontemi matrix. Other years use the annual matrix.
NEMONTEMI_STARTS = {
    -1: (2, 15),  # 2 Cozcacuauhtli, 2022-03-07 through 2022-03-11
    0: (7, 0),    # 7 Cipactli, shown in the 10 Tochtli year matrix
}


@dataclass(frozen=True)
class CalendarPosition:
    """The shared position used to derive all calendar cycles for an instant."""

    year_offset: int
    year_start: datetime
    xihuitl_number: int
    xihuitl_sign: str
    day_index: int
    tonalli_day_offset: int


def year_start_for_offset(year_offset: int) -> datetime:
    """Return the UTC instant at this 365.25-day offset from the anchor."""
    return ANCHOR_UTC + YEAR_LENGTH * year_offset


def calendar_position_for_instant(instant: datetime) -> CalendarPosition:
    """Resolve an aware instant using Mexico City year and day boundaries."""
    if instant.tzinfo is None or instant.utcoffset() is None:
        raise ValueError("Calendar instants must include a timezone")

    local_instant = instant.astimezone(MEXICO_CITY)
    instant_utc = local_instant.astimezone(timezone.utc)
    year_offset = (instant_utc - ANCHOR_UTC) // YEAR_LENGTH

    year_start_utc = year_start_for_offset(year_offset)
    year_start_local = year_start_utc.astimezone(MEXICO_CITY)
    year_sign_index = (ANCHOR_YEAR_SIGN_INDEX + year_offset) % len(YEAR_SIGNS)
    year_sign = YEAR_SIGNS[year_sign_index]
    year_number = (ANCHOR_XIHUITL_NUMBER - 1 + year_offset) % 13 + 1

    # The workbook's annual boundaries advance by six hours per year. Within
    # each year, use that year's boundary clock time for the day rollover.
    boundary_time = year_start_local.timetz().replace(tzinfo=None)
    local_time = local_instant.timetz().replace(tzinfo=None)
    effective_day = local_instant.date()
    if local_time < boundary_time:
        effective_day -= timedelta(days=1)

    day_index = (effective_day - year_start_local.date()).days
    tonalli_day_offset = (effective_day - ANCHOR_DATE).days
    return CalendarPosition(
        year_offset=year_offset,
        year_start=year_start_local,
        xihuitl_number=year_number,
        xihuitl_sign=year_sign,
        day_index=day_index,
        tonalli_day_offset=tonalli_day_offset,
    )


def calendar_position_for_date(selected_date: date) -> CalendarPosition:
    """Interpret a date-only request at local noon in Mexico City."""
    local_noon = datetime.combine(selected_date, time(hour=12), tzinfo=MEXICO_CITY)
    return calendar_position_for_instant(local_noon)


def calculate_tonalpohualli(day_index: int, year_offset: int = 0) -> dict:
    """Calculate the workbook's year-specific 20-sign × 13-number matrix.

    The supplied 2017–2022 matrices set Cipactli to 11, 7, 3, 12, 8, and 4;
    each year's opening number therefore moves back four positions.
    """
    if day_index >= 360 and year_offset in NEMONTEMI_STARTS:
        start_number, start_sign_index = NEMONTEMI_STARTS[year_offset]
        # The 0.25-day remainder extends the final named Nemontemi day.
        nemontemi_day = min(day_index - 360, 4)
        number = (start_number - 1 + nemontemi_day) % 13 + 1
        sign_index = (start_sign_index + nemontemi_day) % len(DAY_SIGNS)
    else:
        year_start_number = (ANCHOR_TONALLI_NUMBER - 1 - 4 * year_offset) % 13 + 1
        cycle_day_index = min(day_index, 364)
        number = (year_start_number - 1 + cycle_day_index) % 13 + 1
        sign_index = (ANCHOR_DAY_SIGN_INDEX + cycle_day_index) % len(DAY_SIGNS)
    sign = DAY_SIGNS[sign_index]
    return {"number": number, "sign": sign["nahuatl"], "english": sign["english"]}


def calculate_trecena(day_index: int, year_offset: int = 0) -> dict:
    """Return the sign naming the 13-day period containing this Tonalli."""
    tonalli = calculate_tonalpohualli(day_index, year_offset)
    sign_index = (ANCHOR_DAY_SIGN_INDEX + min(day_index, 364)) % len(DAY_SIGNS)
    if day_index >= 360 and year_offset in NEMONTEMI_STARTS:
        _, sign_index = NEMONTEMI_STARTS[year_offset]
        sign_index = (sign_index + min(day_index - 360, 4)) % len(DAY_SIGNS)
    days_since_start = tonalli["number"] - 1
    sign_index = (sign_index - days_since_start) % len(DAY_SIGNS)
    sign = DAY_SIGNS[sign_index]
    return {"number": 1, "sign": sign["nahuatl"], "english": sign["english"]}


def calculate_xiuhpohualli(day_index: int) -> dict:
    """Return the veintena and day within the current 365.25-day year."""
    if day_index < 360:
        veintena_index = day_index // 20
        day = (day_index % 20) + 1
        veintena = VEINTENAS[veintena_index]
    else:
        # The 365th day is the final Nemontemi day; its boundary can be
        # shortened by the quarter-day adjustment before the next year starts.
        day = min(day_index - 359, 5)
        veintena = "Nemontemi"
    return {"veintena": veintena, "day": day}


def calculate_xihuitl(position: CalendarPosition) -> dict:
    """Return the 13-number and 4-sign year label for this position."""
    return {"number": position.xihuitl_number, "sign": position.xihuitl_sign}
