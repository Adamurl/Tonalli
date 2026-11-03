import { act, render, screen, waitFor } from "@testing-library/react";
import { motionValue } from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DayScrollExperience } from "../components/DayScrollExperience";
import { makeCalendarDate } from "./fixtures/calendar";

const progress = motionValue(0);
const preferences = { reduced: false };
vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  useScroll: () => ({ scrollYProgress: progress }),
  useReducedMotion: () => preferences.reduced,
}));

afterEach(() => {
  progress.set(0);
  preferences.reduced = false;
  vi.restoreAllMocks();
});

describe("scroll-driven day experience", () => {
  it("expands, covers, and reverses without navigation or an image swap", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return (this.classList.contains("day-sign__art-anchor")
        ? { left: 600, top: 400, width: 140, height: 60 }
        : { left: 0, top: 0, width: 1440, height: 900 }) as DOMRect;
    });
    const { container, unmount } = render(<DayScrollExperience calendar={makeCalendarDate()} controls={<button>Change date</button>} />);
    const artwork = screen.getByRole("img", { name: "Cipactli day sign artwork" });
    const frame = container.querySelector(".day-scroll-art")!;
    const panel = container.querySelector(".interpretation-cover")!;
    const initialUrl = window.location.href;
    await waitFor(() => expect(frame).toHaveStyle({ width: "140px", left: "600px" }));

    act(() => progress.set(0.2));
    await waitFor(() => expect(frame).toHaveStyle({ width: "790px", left: "300px" }));
    expect(document.documentElement.dataset.dayScene).toBe("light");
    expect(screen.queryByRole("button", { name: "Change date" })).not.toBeInTheDocument();

    act(() => progress.set(0.4));
    await waitFor(() => expect(frame).toHaveStyle({ width: "1440px", height: "900px", top: "0px", left: "0px" }));
    expect(document.documentElement.dataset.dayScene).toBe("image");

    act(() => progress.set(0.8));
    await waitFor(() => expect(panel.getAttribute("style")).toContain("translateY(50%"));
    expect(frame).toHaveStyle({ top: "0px", height: "900px" });

    act(() => progress.set(1));
    await waitFor(() => expect(panel).toHaveStyle({ transform: "none" }));
    expect(screen.getByRole("heading", { name: "An interpretation of the date" })).toBeInTheDocument();
    expect(document.documentElement.dataset.dayScene).toBe("light");

    act(() => progress.set(0));
    await waitFor(() => expect(frame).toHaveStyle({ left: "600px", top: "400px", width: "140px", height: "60px" }));
    expect(screen.getByRole("img", { name: "Cipactli day sign artwork" })).toBe(artwork);
    expect(screen.getByRole("button", { name: "Change date" })).toBeInTheDocument();
    expect(window.location.href).toBe(initialUrl);
    unmount();
    expect(document.documentElement.dataset.dayScene).toBeUndefined();
  });

  it("presents readable sections without pinned motion when reduced motion is preferred", () => {
    preferences.reduced = true;
    const { container } = render(<DayScrollExperience calendar={makeCalendarDate()} controls={null} />);
    expect(container.querySelector(".day-scroll-track")).toBeNull();
    expect(screen.getByRole("heading", { name: "Ce Cipactli" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1 Cipactli" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "An interpretation of the date" })).toBeInTheDocument();
  });
});
