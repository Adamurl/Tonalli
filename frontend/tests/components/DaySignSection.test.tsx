import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DaySignSection } from "../../components/DaySignSection";

const daySigns = [
  "Acatl",
  "Atl",
  "Calli",
  "Cipactli",
  "Coatl",
  "Cozcacuauhtli",
  "Cuauhtli",
  "Cuetzpalin",
  "Ehecatl",
  "Itzcuintli",
  "Malinalli",
  "Mazatl",
  "Miquiztli",
  "Ocelotl",
  "Ollin",
  "Ozomahtli",
  "Quiahuitl",
  "Tecpatl",
  "Tochtli",
  "Xochitl",
];

describe("DaySignSection", () => {
  it("shows the Nahuatl number and sign, English labels, and matching artwork", () => {
    render(
      <DaySignSection sign={{ number: 7, sign: "Mazatl", english: "Deer" }} date="2026-03-29" />,
    );

    expect(screen.getByRole("heading", { name: "Chicome Mazatl" })).toBeInTheDocument();
    expect(screen.getByText("Chicome")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Deer")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Mazatl day sign artwork" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Mazatl day details for 2026-03-29" })).toHaveAttribute("href", "/2026-03-29");
  });

  it("shows the Learn More cursor cue on the image and title, and links both title words", () => {
    render(
      <DaySignSection sign={{ number: 7, sign: "Mazatl", english: "Deer" }} date="2026-03-29" />,
    );
    const artworkLink = screen.getByRole("link", { name: "Open Mazatl day details for 2026-03-29" });
    const numberLink = screen.getByRole("link", { name: "Open day 7 details for 2026-03-29" });
    const titleLink = screen.getByRole("link", { name: "Open Mazatl day-sign details for 2026-03-29" });

    expect(numberLink).toHaveAttribute("href", "/2026-03-29");
    expect(titleLink).toHaveAttribute("href", "/2026-03-29");

    fireEvent.pointerMove(titleLink, {
      pointerType: "mouse",
      clientX: 120,
      clientY: 80,
    });
    expect(screen.getByRole("tooltip", { name: "Learn More" })).toHaveStyle({
      left: "120px",
      top: "80px",
    });

    fireEvent.focus(artworkLink);
    expect(screen.getByRole("tooltip", { name: "Learn More" })).toBeInTheDocument();
  });

  it.each(daySigns)("uses the matching BG_%s.jpg photo", (sign) => {
    render(
      <DaySignSection sign={{ number: 1, sign, english: "Test translation" }} date="2026-03-29" />,
    );

    const artwork = screen.getByRole("img", { name: `${sign} day sign artwork` });
    const image = artwork.querySelector("img");

    expect(image?.getAttribute("src")).toContain(`BG_${sign}.jpg`);
  });

  it("keeps a sign visible and shows a placeholder when no matching photo exists", () => {
    render(
      <DaySignSection sign={{ number: 14, sign: "UnknownSign", english: "Unknown" }} date="2026-03-29" />,
    );

    expect(screen.getByRole("heading", { name: "UnknownSign" })).toBeInTheDocument();
    expect(screen.getByText("UnknownSign")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "UnknownSign day sign artwork placeholder" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "UnknownSign day sign artwork" })).not.toBeInTheDocument();
  });
});
