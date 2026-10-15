import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { XihuitlPanel } from "../../components/XihuitlPanel";

describe("XihuitlPanel", () => {
  it("shows the year sign and its number below the glyph", () => {
    render(<XihuitlPanel sign={{ number: 4, sign: "Acatl" }} />);

    const panel = screen.getByRole("region", { name: "Xihuitl" });
    expect(panel).toHaveTextContent("Solar Year");
    expect(screen.getByRole("heading", { name: "Xihuitl" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Acatl day-sign glyph" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "4 dots" })).toHaveClass("dot-count--small");
  });
});
