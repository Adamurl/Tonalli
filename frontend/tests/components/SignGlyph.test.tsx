import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SignGlyph } from "../../components/SignGlyph";

describe("SignGlyph", () => {
  it("uses the exact sign name for a known glyph", () => {
    render(<SignGlyph sign="Mazatl" size="hero" />);

    expect(screen.getByRole("img", { name: "Mazatl day-sign glyph" })).toBeInTheDocument();
  });

  it("uses the updated Cozcacuauhtli artwork", () => {
    render(<SignGlyph sign="Cozcacuauhtli" size="small" />);

    expect(
      screen.getByRole("img", { name: "Cozcacuauhtli day-sign glyph" }),
    ).toBeInTheDocument();
  });

  it("shows a sign-specific placeholder when artwork is missing", () => {
    render(<SignGlyph sign="MissingSign" size="small" />);

    expect(
      screen.getByRole("img", { name: "Glyph for MissingSign will be added later" }),
    ).toHaveTextContent("GLYPH");
  });

  it("announces an empty glyph while calendar data is loading", () => {
    render(<SignGlyph size="hero" />);

    expect(screen.getByRole("img", { name: "Loading calendar glyph" })).toBeInTheDocument();
  });
});
