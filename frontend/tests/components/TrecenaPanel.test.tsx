import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TrecenaPanel } from "../../components/TrecenaPanel";

describe("TrecenaPanel", () => {
  it("identifies the first-day sign of the 13-day period", () => {
    render(<TrecenaPanel sign={{ sign: "Cipactli", english: "Crocodile" }} />);

    const panel = screen.getByRole("region", { name: "Trecena" });
    expect(panel).toHaveTextContent("13-Day Period");
    expect(screen.getByRole("heading", { name: "Trecena" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Cipactli day-sign glyph" }),
    ).toBeInTheDocument();
  });
});
