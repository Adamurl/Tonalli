import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SignStorySection } from "../../components/SignStorySection";
import { makeCalendarDate } from "../fixtures/calendar";

describe("SignStorySection", () => {
  it.each([
    ["Cipactli", "Crocodile"], ["Ehecatl", "Wind"], ["Calli", "House"],
    ["Cuetzpalin", "Iguana"], ["Coatl", "Snake"], ["Miquiztli", "Death"],
    ["Mazatl", "Deer"], ["Tochtli", "Rabbit"], ["Atl", "Water"],
    ["Itzcuintli", "Dog"], ["Malinalli", "Grass"], ["Acatl", "Reed"],
    ["Ocelotl", "Jaguar"], ["Cuauhtli", "Eagle"], ["Cozcacuauhtli", "Vulture"], ["Ozomahtli", "Monkey"],
    ["Ollin", "Movement"], ["Tecpatl", "Flint"], ["Quiahuitl", "Rain"], ["Xochitl", "Flower"],
  ])("shows the decorative %s artwork", (name, filename) => {
    const { container } = render(<SignStorySection sign={{ ...makeCalendarDate().day_sign, name }} />);
    const artwork = container.querySelector("img");
    expect(artwork).toHaveAttribute("src", expect.stringContaining(`${filename}.png`));
    expect(artwork).toHaveAttribute("alt", "");
    expect(artwork?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("clears the previous artwork when switching to a sign without a PNG", () => {
    const sign = makeCalendarDate().day_sign;
    const { container, rerender } = render(<SignStorySection sign={sign} />);
    expect(container.querySelector("img")).toBeInTheDocument();
    rerender(<SignStorySection sign={{ ...sign, name: "MissingSign", english: "Unknown" }} />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /The meaning behind MissingSign/i })).toBeVisible();
  });

  it("preserves the reference heading and shows the selected sign description", () => {
    const sign = makeCalendarDate().day_sign;
    const { container } = render(<SignStorySection sign={{ ...sign, description: `  ${sign.description}  ` }} />);
    expect(screen.getByRole("heading", { name: /The meaning behind Cipactli/i })).toBeInTheDocument();
    expect(container.querySelector("section > div:last-child > p")?.textContent).toContain("Cipactli evokes the living earth");
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
