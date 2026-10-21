import unittest
from datetime import date, timedelta

from app.calendar_conversion import (
    ANCHOR_DATE,
    MEXICO_CITY,
    YEAR_SIGNS,
    calendar_position_for_date,
    calendar_position_for_instant,
    calculate_tonalpohualli,
    calculate_trecena,
    calculate_xiuhpohualli,
    calculate_xihuitl,
    year_start_for_offset,
)


class CalendarConversionTests(unittest.TestCase):
    def test_workbook_anchor(self) -> None:
        position = calendar_position_for_date(date(2022, 3, 12))

        self.assertEqual(position.xihuitl_number, 10)
        self.assertEqual(position.xihuitl_sign, "Tochtli")
        self.assertEqual(position.day_index, 0)
        self.assertEqual(position.tonalli_day_offset, 0)
        self.assertEqual(calculate_xihuitl(position), {"number": 10, "sign": "Tochtli"})
        self.assertEqual(calculate_tonalpohualli(0)["number"], 4)
        self.assertEqual(calculate_tonalpohualli(0)["sign"], "Cipactli")
        self.assertEqual(calculate_xiuhpohualli(0), {"veintena": "Atlacahualo", "day": 1})
        self.assertEqual(calculate_trecena(0)["sign"], "Tecpatl")

    def test_2013_year_alignment(self) -> None:
        position = calendar_position_for_date(date(2013, 3, 12))

        self.assertEqual(position.xihuitl_number, 1)
        self.assertEqual(position.xihuitl_sign, "Calli")
        self.assertEqual(calculate_xihuitl(position), {"number": 1, "sign": "Calli"})

    def test_date_only_uses_local_noon_for_year_boundary(self) -> None:
        # 2023's boundary is 12:43 p.m.; local noon still belongs to 10 Tochtli.
        position = calendar_position_for_date(date(2023, 3, 12))
        self.assertEqual(position.xihuitl_number, 10)
        self.assertEqual(position.xihuitl_sign, "Tochtli")

        next_day = calendar_position_for_date(date(2023, 3, 13))
        self.assertEqual(next_day.xihuitl_number, 11)
        self.assertEqual(next_day.xihuitl_sign, "Acatl")

    def test_year_signs_and_boundary_times_follow_four_year_cycle(self) -> None:
        expected_times = [(0, 43), (6, 43), (12, 43), (18, 43)]

        for offset in range(4):
            with self.subTest(year_offset=offset):
                start = year_start_for_offset(offset)
                position = calendar_position_for_instant(start)

                self.assertEqual(position.xihuitl_sign, YEAR_SIGNS[(1 + offset) % 4])
                self.assertEqual(
                    (position.year_start.hour, position.year_start.minute),
                    expected_times[(1 + offset) % 4],
                )
                self.assertEqual(position.day_index, 0)

    def test_day_boundary_advances_day_position(self) -> None:
        # Each year uses its own boundary clock time for the day rollover.
        for offset in range(4):
            with self.subTest(year_offset=offset):
                start = year_start_for_offset(offset)
                first_day_boundary = start + timedelta(days=1)
                before = calendar_position_for_instant(
                    first_day_boundary - timedelta(seconds=1)
                )
                at_boundary = calendar_position_for_instant(first_day_boundary)

                self.assertEqual(before.day_index, 0)
                self.assertEqual(at_boundary.day_index, 1)

    def test_tonalpohualli_remains_continuous_and_repeats_after_260_days(self) -> None:
        self.assertEqual(calculate_tonalpohualli(1)["number"], 5)
        self.assertEqual(calculate_tonalpohualli(1)["sign"], "Ehecatl")
        self.assertEqual(calculate_tonalpohualli(260), calculate_tonalpohualli(0))
        self.assertEqual(calculate_trecena(260), calculate_trecena(0))
        self.assertNotEqual(calculate_trecena(13), calculate_trecena(0))

    def test_nemontemi_has_five_numbered_days(self) -> None:
        self.assertEqual(calculate_xiuhpohualli(359), {"veintena": "Izcalli", "day": 20})
        self.assertEqual(calculate_xiuhpohualli(360), {"veintena": "Nemontemi", "day": 1})
        self.assertEqual(calculate_xiuhpohualli(364), {"veintena": "Nemontemi", "day": 5})
        self.assertEqual(calculate_xiuhpohualli(365), {"veintena": "Nemontemi", "day": 5})

    def test_date_only_anchor_is_in_mexico_city(self) -> None:
        position = calendar_position_for_date(ANCHOR_DATE)
        self.assertEqual(position.year_start.tzinfo, MEXICO_CITY)


if __name__ == "__main__":
    unittest.main()
