import { afterEach, describe, expect, it, vi } from "vitest";

import {
  formatDisplayDate,
  getCalendarDate,
  isValidCalendarDate,
  localDateString,
  NAHUATL_NUMBERS,
} from "../lib/calendar";

describe("calendar utilities", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("accepts only real ISO calendar dates", () => {
    expect(isValidCalendarDate("2026-03-29")).toBe(true);
    expect(isValidCalendarDate("2026-02-30")).toBe(false);
    expect(isValidCalendarDate("03-29-2026")).toBe(false);
  });

  it("formats local dates without shifting the calendar day", () => {
    expect(localDateString(new Date(2026, 2, 9, 12))).toBe("2026-03-09");
    expect(formatDisplayDate("2026-03-09")).toEqual({
      month: "March",
      day: "9",
      year: "2026",
    });
  });

  it("provides a fixed Nahuatl reading for each Tonalpohualli number", () => {
    expect(Object.keys(NAHUATL_NUMBERS)).toHaveLength(13);
    expect(NAHUATL_NUMBERS[1]).toBe("Ce");
    expect(NAHUATL_NUMBERS[7]).toBe("Chicome");
    expect(NAHUATL_NUMBERS[13]).toBe("Matlactli omei");
  });

  it("requests a date without caching and returns the parsed calendar", async () => {
    const data = { date: "2026-03-29", tonalpohualli: { sign: "Cipactli" } };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => data });
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();

    await expect(getCalendarDate("2026-03-29", controller.signal)).resolves.toEqual(data);
    expect(fetchMock).toHaveBeenCalledWith("/api/calendar/2026-03-29", {
      cache: "no-store",
      signal: controller.signal,
    });
  });

  it("surfaces the HTTP status when the calendar service fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    await expect(
      getCalendarDate("2026-03-29", new AbortController().signal),
    ).rejects.toThrow("The calendar service returned 503.");
  });
});
