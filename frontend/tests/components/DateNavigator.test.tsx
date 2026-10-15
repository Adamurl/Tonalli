import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DateNavigator } from "../../components/DateNavigator";

describe("DateNavigator", () => {
  it("sends previous and next day actions to its owner", async () => {
    const user = userEvent.setup();
    const onShift = vi.fn();

    render(
      <DateNavigator date="2026-03-29" onChange={vi.fn()} onShift={onShift} />,
    );

    await user.click(screen.getByRole("button", { name: "Previous day" }));
    await user.click(screen.getByRole("button", { name: "Next day" }));

    expect(onShift).toHaveBeenNthCalledWith(1, -1);
    expect(onShift).toHaveBeenNthCalledWith(2, 1);
  });

  it("exposes its selected date and reports changes", () => {
    const onChange = vi.fn();
    render(
      <DateNavigator date="2026-03-29" onChange={onChange} onShift={vi.fn()} />,
    );

    const input = screen.getByLabelText("Calendar date");
    expect(input).toHaveValue("2026-03-29");

    fireEvent.change(input, { target: { value: "2026-03-30" } });
    expect(onChange).toHaveBeenCalledWith("2026-03-30");
  });
});
