import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
    expect(screen.getByText(makeCalendarDate().day_sign.description!)).toBeInTheDocument();
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
    expect(screen.getByText(makeCalendarDate().day_sign.description!)).toBeInTheDocument();
  });

  it.each([false, true])("updates the meaning when the selected sign changes (reduced motion %s)", (reduced) => {
    preferences.reduced = reduced;
    const { container, rerender } = render(<DayScrollExperience calendar={makeCalendarDate()} controls={null} />);
    const description = "Ehecatl evokes wind, breath, and the movement that brings life into motion.";
    rerender(<DayScrollExperience calendar={makeCalendarDate({
      tonalpohualli: { number: 2, sign: "Ehecatl", english: "Wind" },
      day_sign: { name: "Ehecatl", english: "Wind", position: 2, description: description },
    })} controls={null} />);
    expect(container.querySelector("#interpretation-heading")).toHaveTextContent("An interpretation of the date");
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.queryByText(makeCalendarDate().day_sign.description!)).not.toBeInTheDocument();
    const interpretation = container.querySelector(".interpretation")!;
    const story = screen.getByRole("region", { name: /The meaning behind.*the sign/i });
    expect(container.querySelectorAll(".interpretation__copy p")).toHaveLength(2);
    expect(interpretation).toHaveTextContent("Lorem ipsum");
    expect(interpretation).toHaveTextContent("Duis aute irure");
    expect(interpretation).not.toHaveTextContent(description);
    expect(within(story).getByText(description)).toBeInTheDocument();
    expect(story).not.toHaveTextContent("Lorem ipsum");
    expect(story).not.toHaveTextContent("Duis aute irure");
    expect(container).not.toHaveTextContent("Itzcuintli");
    expect(container).not.toHaveTextContent("Mictlantecuhtli");
  });

  it.each([false, true])("places the separate story after the day interpretation (reduced motion %s)", (reduced) => {
    preferences.reduced = reduced;
    const { container } = render(<DayScrollExperience calendar={makeCalendarDate()} controls={null} />);
    const interpretation = container.querySelector(".interpretation");
    const story = screen.getByRole("region", { name: /The meaning behind.*the sign/i });
    expect(interpretation?.compareDocumentPosition(story)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(story.closest(".day-scroll-track")).toBeNull();
    expect(story.closest(".interpretation")).toBeNull();
  });

  it.each([false, true])("tracks story contrast on entry, reverse scroll, date change and cleanup (reduced motion %s)", async (reduced) => {
    preferences.reduced = reduced;
    let storyTop = 1000;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      const top = this.getAttribute("aria-labelledby") === "sign-story-heading" ? storyTop : 2000;
      return new DOMRect(0, top, 1400, 900);
    });
    const { rerender, unmount } = render(<DayScrollExperience calendar={makeCalendarDate()} controls={null} />);
    expect(document.documentElement.dataset.dayScene).toBe("light");
    storyTop = 0;
    fireEvent.scroll(window);
    await waitFor(() => expect(document.documentElement.dataset.dayScene).toBe("image"));
    rerender(<DayScrollExperience calendar={makeCalendarDate({ date: "2026-03-30" })} controls={null} />);
    expect(document.documentElement.dataset.dayScene).toBe("image");
    storyTop = 1000;
    fireEvent.scroll(window);
    await waitFor(() => expect(document.documentElement.dataset.dayScene).toBe("light"));
    unmount();
    expect(document.documentElement.dataset.dayScene).toBeUndefined();
    storyTop = 0;
    fireEvent.scroll(window);
    expect(document.documentElement.dataset.dayScene).toBeUndefined();
  });

  it("tracks the normal-flow hero contrast in reduced motion", async () => {
    preferences.reduced = true;
    let heroTop = 1000;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return new DOMRect(0, this.classList.contains("day-hero") ? heroTop : 2000, 1400, 900);
    });
    render(<DayScrollExperience calendar={makeCalendarDate()} controls={null} />);
    expect(document.documentElement.dataset.dayScene).toBe("light");
    heroTop = 0;
    fireEvent.scroll(window);
    await waitFor(() => expect(document.documentElement.dataset.dayScene).toBe("image"));
    heroTop = -1000;
    fireEvent.scroll(window);
    await waitFor(() => expect(document.documentElement.dataset.dayScene).toBe("light"));
  });

  it.each([null, "", "   "])("uses neutral copy when the description is %s", (description) => {
    preferences.reduced = true;
    render(<DayScrollExperience calendar={makeCalendarDate({
      day_sign: { ...makeCalendarDate().day_sign, description: description },
    })} controls={null} />);
    const story = screen.getByRole("region", { name: /The meaning behind.*the sign/i });
    expect(within(story).getByText("A description of this day sign is not available yet.")).toBeInTheDocument();
  });
});
