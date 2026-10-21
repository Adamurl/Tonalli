import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DayDetailView } from "../components/DayDetailView";
import { DayTransitionProvider, useDayTransition } from "../components/DayTransitionContext";
import { getCalendarDate } from "../lib/calendar";
import { makeCalendarDate } from "./fixtures/calendar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/2026-03-29",
}));
vi.mock("../components/DaySignSection", () => ({
  DAY_SIGN_LAYOUT_TRANSITION: { layout: { duration: 0.9 } },
  DAY_SIGN_EXPANSION_TRANSITION: { layout: { duration: 0.9 } },
  DaySignArtwork: ({
    sign,
    onLayoutAnimationComplete,
    borderRadius,
  }: {
    sign: { sign: string };
    onLayoutAnimationComplete?: () => void;
    borderRadius?: number;
  }) => (
    <button
      type="button"
      aria-label={`${sign.sign} artwork`}
      data-border-radius={borderRadius}
      onClick={onLayoutAnimationComplete}
    />
  ),
}));
vi.mock("../lib/calendar", async (importOriginal) => {
  const calendar = await importOriginal<typeof import("../lib/calendar")>();
  return { ...calendar, getCalendarDate: vi.fn() };
});

const fetchCalendar = vi.mocked(getCalendarDate);

function OverlayHarness() {
  const { setPreview } = useDayTransition();
  const [open, setOpen] = useState(false);
  const calendar = makeCalendarDate();
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPreview({
            date: calendar.date,
            sign: calendar.tonalpohualli,
            calendar,
          });
          setOpen(true);
        }}
      >
        Open preview
      </button>
      {open && <DayDetailView date={calendar.date} presentation="overlay" />}
    </>
  );
}

describe("DayDetailView overlay", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    fetchCalendar.mockResolvedValue(makeCalendarDate());
  });

  it("reveals the back link with the detail text after expansion", async () => {
    render(
      <DayTransitionProvider>
        <DayDetailView date="2026-03-29" presentation="overlay" />
      </DayTransitionProvider>,
    );

    expect(screen.queryByRole("link", { name: "Back to calendar" })).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole("button", { name: "Cipactli artwork" }));

    expect(screen.getByRole("heading", { name: "Ce Cipactli" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to calendar" })).toHaveAttribute(
      "href",
      "/?date=2026-03-29",
    );
  });

  it("lets the shared layout transition animate corners to the full-screen target", async () => {
    render(
      <DayTransitionProvider>
        <DayDetailView date="2026-03-29" presentation="overlay" />
      </DayTransitionProvider>,
    );

    const artwork = await screen.findByRole("button", { name: "Cipactli artwork" });
    expect(artwork).toHaveAttribute("data-border-radius", "0");

    fireEvent.click(artwork);

    expect(artwork).toHaveAttribute("data-border-radius", "0");
  });

  it("keeps details hidden until artwork expansion completes and reuses loaded calendar data", async () => {
    fetchCalendar.mockClear();
    render(
      <DayTransitionProvider>
        <OverlayHarness />
      </DayTransitionProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open preview" }));

    expect(screen.getByRole("dialog", { name: "Day details" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Ce Cipactli" })).not.toBeInTheDocument();
    expect(fetchCalendar).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Cipactli artwork" }));

    expect(await screen.findByRole("heading", { name: "Ce Cipactli" })).toBeInTheDocument();
    expect(screen.getByText("Day 1 · Crocodile")).toBeInTheDocument();
  });

  it("recovers the clicked day's artwork and details when route navigation loses React context", async () => {
    const calendar = makeCalendarDate();
    window.sessionStorage.setItem("tonalli:day-artwork-preview", JSON.stringify({
      date: calendar.date,
      sign: calendar.tonalpohualli,
      calendar,
    }));
    fetchCalendar.mockClear();

    render(
      <DayTransitionProvider>
        <DayDetailView date="" presentation="overlay" />
      </DayTransitionProvider>,
    );

    expect(await screen.findByRole("button", { name: "Cipactli artwork" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Ce Cipactli" })).not.toBeInTheDocument();
    expect(fetchCalendar).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Cipactli artwork" }));

    expect(await screen.findByRole("heading", { name: "Ce Cipactli" })).toBeInTheDocument();
  });
});
