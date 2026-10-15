import type { CalendarDate } from "../../lib/calendar";

export function makeCalendarDate(
  overrides: Partial<CalendarDate> = {},
): CalendarDate {
  return {
    date: "2026-03-29",
    correlation: "test-correlation",
    tonalpohualli: { number: 1, sign: "Cipactli", english: "Crocodile" },
    day_sign: { name: "Cipactli", english: "Crocodile", position: 1 },
    trecena: { sign: "Cipactli", english: "Crocodile" },
    xiuhpohualli: { veintena: "Atlcahualo", day: 8 },
    xihuitl: { number: 2, sign: "Acatl" },
    ...overrides,
  };
}
