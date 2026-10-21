import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DayDetailPage from "../app/[date]/page";
import { DayTransitionProvider, useDayTransition } from "../components/DayTransitionContext";
import { getCalendarDate } from "../lib/calendar";
import { makeCalendarDate } from "./fixtures/calendar";

const { useParams, usePathname, back } = vi.hoisted(() => ({
  useParams: vi.fn(),
  usePathname: vi.fn(),
  back: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useParams, usePathname, useRouter: () => ({ back }) }));
vi.mock("../lib/calendar", async (importOriginal) => {
  const calendar = await importOriginal<typeof import("../lib/calendar")>();
  return { ...calendar, getCalendarDate: vi.fn() };
});

const fetchCalendar = vi.mocked(getCalendarDate);

describe("day detail page", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    useParams.mockReturnValue({ date: "2026-03-29" });
    usePathname.mockReturnValue("/2026-03-29");
  });

  it("loads the requested date and shows all calendar details", async () => {
    fetchCalendar.mockResolvedValue(makeCalendarDate());
    render(<DayDetailPage />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading this day");
    expect(await screen.findByRole("heading", { name: "Ce Cipactli" })).toBeInTheDocument();
    expect(screen.getByText("Day 1 · Crocodile")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trecena" })).toBeInTheDocument();
    expect(screen.getByText("Atlacahualo, day 8")).toBeInTheDocument();
    expect(screen.getByText("What is left by the water")).toBeInTheDocument();
    expect(screen.getByText("Year 2 · Acatl")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to calendar/i })).toHaveAttribute(
      "href",
      "/?date=2026-03-29",
    );
    expect(fetchCalendar).toHaveBeenCalledWith("2026-03-29", expect.any(AbortSignal));
  });

  it("shows an invalid date message without calling the calendar API", async () => {
    useParams.mockReturnValue({ date: "not-a-date" });
    usePathname.mockReturnValue("/not-a-date");
    render(<DayDetailPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Use a date in YYYY-MM-DD format");
    expect(fetchCalendar).not.toHaveBeenCalled();
  });

  it("shows the selected artwork while the detail request is still loading", async () => {
    fetchCalendar.mockReturnValue(new Promise(() => {}));

    function SeedPreview() {
      const { setPreview } = useDayTransition();
      return (
        <button
          type="button"
          onClick={() => setPreview({
            date: "2026-03-29",
            sign: { number: 1, sign: "Cipactli", english: "Crocodile" },
          })}
        >
          Seed artwork preview
        </button>
      );
    }

    render(
      <DayTransitionProvider>
        <SeedPreview />
        <DayDetailPage />
      </DayTransitionProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Seed artwork preview" }));

    expect(screen.getByRole("img", { name: "Cipactli day sign artwork" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Loading this day");
  });

  it("shows a recoverable request error and retries the same date", async () => {
    fetchCalendar
      .mockRejectedValueOnce(new Error("Calendar service unavailable"))
      .mockResolvedValueOnce(makeCalendarDate());
    render(<DayDetailPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Calendar service unavailable");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "Ce Cipactli" })).toBeInTheDocument();
    expect(fetchCalendar).toHaveBeenLastCalledWith("2026-03-29", expect.any(AbortSignal));
  });
});
