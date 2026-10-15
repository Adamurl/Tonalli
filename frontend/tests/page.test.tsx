import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Home from "../app/page";
import { getCalendarDate } from "../lib/calendar";
import { makeCalendarDate } from "./fixtures/calendar";

vi.mock("../lib/calendar", async (importOriginal) => {
  const calendar = await importOriginal<typeof import("../lib/calendar")>();
  return {
    ...calendar,
    getCalendarDate: vi.fn(),
    localDateString: vi.fn(() => "2026-03-29"),
  };
});

const fetchCalendar = vi.mocked(getCalendarDate);

describe("calendar home page", () => {
  it("shows loading feedback and then the requested day", async () => {
    fetchCalendar.mockResolvedValue(makeCalendarDate());
    render(<Home />);

    expect(screen.getByRole("status")).toHaveTextContent("Reading today’s calendar");
    expect(await screen.findByRole("heading", { name: "Ce Cipactli" })).toBeInTheDocument();
    expect(fetchCalendar).toHaveBeenCalledTimes(1);
    expect(fetchCalendar).toHaveBeenCalledWith("2026-03-29", expect.any(AbortSignal));
  });

  it("shows a recoverable error and retries the same date", async () => {
    const user = userEvent.setup();
    fetchCalendar
      .mockRejectedValueOnce(new Error("Calendar service unavailable"))
      .mockResolvedValueOnce(makeCalendarDate());
    render(<Home />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Calendar service unavailable",
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "Ce Cipactli" })).toBeInTheDocument();
    expect(fetchCalendar).toHaveBeenNthCalledWith(
      2,
      "2026-03-29",
      expect.any(AbortSignal),
    );
  });

  it("fetches a newly selected date", async () => {
    fetchCalendar.mockResolvedValue(makeCalendarDate());
    render(<Home />);
    await screen.findByRole("heading", { name: "Ce Cipactli" });

    fireEvent.change(screen.getByLabelText("Calendar date"), {
      target: { value: "2026-03-30" },
    });

    await waitFor(() =>
      expect(fetchCalendar).toHaveBeenLastCalledWith(
        "2026-03-30",
        expect.any(AbortSignal),
      ),
    );
  });

  it("ignores a stale response after the user changes the selected date", async () => {
    const requests: Array<{
      resolve: (value: ReturnType<typeof makeCalendarDate>) => void;
    }> = [];
    fetchCalendar.mockImplementation(
      () =>
        new Promise((resolve) => {
          requests.push({ resolve });
        }),
    );
    render(<Home />);
    await waitFor(() => expect(requests).toHaveLength(1));

    fireEvent.change(screen.getByLabelText("Calendar date"), {
      target: { value: "2026-03-30" },
    });
    await waitFor(() => expect(requests).toHaveLength(2));

    await act(async () => {
      requests[1].resolve(
        makeCalendarDate({
          date: "2026-03-30",
          tonalpohualli: { number: 2, sign: "Ehecatl", english: "Wind" },
        }),
      );
    });
    expect(await screen.findByRole("heading", { name: "Ome Ehecatl" })).toBeInTheDocument();

    await act(async () => {
      requests[0].resolve(makeCalendarDate());
    });
    expect(screen.getByRole("heading", { name: "Ome Ehecatl" })).toBeInTheDocument();
  });
});
