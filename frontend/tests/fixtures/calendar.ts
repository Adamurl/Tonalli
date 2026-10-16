import type { CalendarDate } from "../../lib/calendar";

export function makeCalendarDate(
  overrides: Partial<CalendarDate> = {},
): CalendarDate {
  return {
    date: "2026-03-29",
    correlation: "test-correlation",
    tonalpohualli: { number: 1, sign: "Cipactli", english: "Crocodile" },
    day_sign: { name: "Cipactli", english: "Crocodile", position: 1 },
    trecena: { number: 1, sign: "Cipactli", english: "Crocodile" },
    xiuhpohualli: {
      veintena: "Atlacahualo",
      day: 8,
      position: 1,
      reference: {
        position: 1,
        name: "Atlacahualo",
        span: "March 12–31",
        span_es: "12–31 de marzo",
        meaning_es: "Lo dejado por las aguas",
        meaning_en: "What is left by the water",
        correlation: "workbook_2022_mexico_city",
        source: "Tonalpohualli updated 01.11.22.xlsx, Reference worksheet",
      },
    },
    xihuitl: { number: 2, sign: "Acatl" },
    ...overrides,
  };
}
