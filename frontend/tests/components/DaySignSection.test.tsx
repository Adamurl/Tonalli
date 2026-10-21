import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DaySignSection } from "../../components/DaySignSection";

describe("DaySignSection", () => {
  it("shows the Nahuatl number and sign, English labels, and reserved artwork space", () => {
    render(
      <DaySignSection sign={{ number: 7, sign: "Mazatl", english: "Deer" }} />,
    );

    expect(screen.getByRole("heading", { name: "Chicome Mazatl" })).toBeInTheDocument();
    expect(screen.getByText("Chicome")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Deer")).toBeInTheDocument();
    expect(screen.getByLabelText("Day sign artwork placeholder")).toBeInTheDocument();
  });

  it("keeps a sign visible when its number has no Nahuatl label", () => {
    render(
      <DaySignSection sign={{ number: 14, sign: "UnknownSign", english: "Unknown" }} />,
    );

    expect(screen.getByRole("heading", { name: "UnknownSign" })).toBeInTheDocument();
    expect(screen.getByText("UnknownSign")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
  });
});
