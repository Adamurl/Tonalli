import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import InterceptedDayDetailPage from "../app/@modal/(.)[date]/page";

vi.mock("../components/DayDetailView", () => ({
  DayDetailView: ({ date, presentation }: { date: string; presentation: string }) => (
    <div data-testid="day-detail-view" data-date={date} data-presentation={presentation} />
  ),
}));

describe("intercepted day route", () => {
  it("passes the intercepted route's own date parameter into the overlay", async () => {
    const route = await InterceptedDayDetailPage({
      params: Promise.resolve({ date: "2026-03-29" }),
    });
    render(route);

    expect(screen.getByTestId("day-detail-view")).toHaveAttribute("data-date", "2026-03-29");
    expect(screen.getByTestId("day-detail-view")).toHaveAttribute("data-presentation", "overlay");
  });
});
