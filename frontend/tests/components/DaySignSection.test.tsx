import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DaySignSection } from "../../components/DaySignSection";

describe("DaySignSection", () => {
  it("shows the Nahuatl number, exact sign, English value, and matching dots", () => {
    render(
      <DaySignSection
        sign={{ number: 7, sign: "Mazatl", english: "Deer" }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Chicome Mazatl" })).toBeInTheDocument();
    expect(screen.getByText("7", { selector: ".day-sign__translation span" })).toBeInTheDocument();
    expect(screen.getByText("Deer")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "7 dots" }).children).toHaveLength(7);
    expect(screen.getByRole("img", { name: "Mazatl day-sign glyph" })).toBeInTheDocument();
  });

  it("keeps a sign visible if its number has no Nahuatl label", () => {
    render(
      <DaySignSection
        sign={{ number: 14, sign: "UnknownSign", english: "Unknown" }}
      />,
    );

    expect(screen.getByRole("heading", { name: "UnknownSign" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Glyph for UnknownSign will be added later" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "13 dots" }).children).toHaveLength(13);
  });
});
