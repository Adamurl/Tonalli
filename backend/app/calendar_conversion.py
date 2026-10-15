"""Date conversion for the initial Alfonso Caso calendar correlation."""

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

# The 18 veintenas in order, followed by the five Nemontemi days.
VEINTENAS = [
    "Atlcahualo",
    "Tlacaxipehualiztli",
    "Tozoztontli",
    "Huey Tozoztli",
    "Toxcatl",
    "Etzalcualiztli",
    "Tecuilhuitontli",
    "Huey Tecuilhuitl",
    "Miccailhuitontli",
    "Huey Miccailhuitl",
    "Ochpaniztli",
    "Pachtontli",
    "Huey Pachtli",
    "Quecholli",
    "Panquetzaliztli",
    "Atemoztli",
    "Tititl",
    "Izcalli",
    "Nemontemi",
]

ANCHOR_JDN = 2276828  # August 13, 1521 Julian: 1-Coatl, solar position 201, 3-Calli.


def gregorian_to_jdn(year: int, month: int, day: int) -> int:
    """Convert a Gregorian calendar date to its integer Julian Day Number."""
    a = (14 - month) // 12
    adjusted_year = year + 4800 - a
    adjusted_month = month + 12 * a - 3
    return (
        day
        + (153 * adjusted_month + 2) // 5
        + 365 * adjusted_year
        + adjusted_year // 4
        - adjusted_year // 100
        + adjusted_year // 400
        - 32045
    )


def calculate_tonalpohualli(jdn: int) -> dict:
    delta = jdn - ANCHOR_JDN
    number = (delta % 13) + 1
    sign = DAY_SIGNS[(4 + delta) % 20]
    return {"number": number, "sign": sign["nahuatl"], "english": sign["english"]}


def calculate_trecena(jdn: int) -> dict:
    """Return the day sign that names the current 13-day period."""
    delta = jdn - ANCHOR_JDN
    trecena_start_delta = delta - (delta % 13)
    sign = DAY_SIGNS[(4 + trecena_start_delta) % 20]
    return {"sign": sign["nahuatl"], "english": sign["english"]}


def calculate_xiuhpohualli(jdn: int) -> dict:
    delta = jdn - ANCHOR_JDN
    solar_position = (delta + 201) % 365
    if solar_position < 360:
        veintena_index = solar_position // 20
        day = (solar_position % 20) + 1
        veintena = VEINTENAS[veintena_index]
    else:
        day = solar_position - 360 + 1
        veintena = "Nemontemi"
    return {"veintena": veintena, "day": day}


def calculate_xihuitl(jdn: int) -> dict:
    delta = jdn - ANCHOR_JDN
    year_offset = (delta + 201) // 365
    year_number = ((3 - 1 + year_offset) % 13) + 1
    year_sign = YEAR_SIGNS[year_offset % 4]
    return {"number": year_number, "sign": year_sign}
