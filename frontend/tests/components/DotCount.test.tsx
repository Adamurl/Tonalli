import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DotCount } from "../../components/DotCount";

describe("DotCount", () => {
  it("announces singular counts accessibly", () => {
    render(<DotCount count={1} />);

    expect(screen.getByRole("img", { name: "1 dot" })).toBeInTheDocument();
    expect(screen.getByRole("img").children).toHaveLength(1);
  });

  it("renders five dots as one full column", () => {
    render(<DotCount count={5} />);

    expect(screen.getByRole("img", { name: "5 dots" }).children).toHaveLength(5);
  });

  it("renders the maximum Tonalpohualli count", () => {
    render(<DotCount count={13} />);

    expect(screen.getByRole("img", { name: "13 dots" }).children).toHaveLength(13);
  });

  it.each([
    [-4, "0 dots"],
    [14, "13 dots"],
    [1.5, "0 dots"],
  ])("normalizes invalid count %s", (count, accessibleName) => {
    render(<DotCount count={count} />);

    expect(screen.getByRole("img", { name: accessibleName }).children).toHaveLength(
      Number.parseInt(accessibleName, 10),
    );
  });

  it("marks the compact solar-year variant accessibly", () => {
    render(<DotCount count={2} small />);

    expect(screen.getByRole("img", { name: "2 dots" })).toHaveClass("dot-count--small");
  });
});
