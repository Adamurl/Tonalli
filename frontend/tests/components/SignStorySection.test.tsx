import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SignStorySection } from "../../components/SignStorySection";
import { makeCalendarDate } from "../fixtures/calendar";

describe("SignStorySection", () => {
  it("preserves the reference heading and shows the selected sign description", () => {
    const sign = makeCalendarDate().day_sign;
    const { container } = render(<SignStorySection sign={{ ...sign, description: `  ${sign.description}  ` }} />);
    expect(screen.getByRole("heading", { name: /The meaning behind.*the sign/i })).toBeInTheDocument();
    expect(screen.getByText(sign.description!)).toBeVisible();
    expect(container).not.toHaveTextContent("Itzcuintli");
    expect(container).not.toHaveTextContent("Mictlantecuhtli");
  });

  it("opens and closes selected sign facts through Learn more", async () => {
    const user = userEvent.setup();
    render(<SignStorySection sign={{ name: "Ehecatl", english: "Wind", position: 2, description: "Wind description." }} />);
    const explanation = screen.getByText("Ehecatl (Wind) is day sign 2 in the twenty-day sequence.");
    expect(explanation).not.toBeVisible();
    await user.click(screen.getByText("Learn more"));
    expect(explanation).toBeVisible();
    await user.click(screen.getByText("Learn more"));
    expect(explanation).not.toBeVisible();
  });

  it.each([null, "", "   "])("shows neutral copy when the description is %s", (description) => {
    render(<SignStorySection sign={{ ...makeCalendarDate().day_sign, description }} />);
    expect(screen.getByText("A description of this day sign is not available yet.")).toBeVisible();
  });
});
