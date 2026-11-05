import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "../../components/SiteHeader";

describe("SiteHeader", () => {
  it("shows the home logo and four desktop navigation labels", () => {
    render(<SiteHeader />);

    const desktopNavigation = screen.getByRole("navigation", {
      name: "Main navigation",
    });
    expect(desktopNavigation).toHaveTextContent("Menu item 1");
    expect(desktopNavigation).toHaveTextContent("Menu item 4");
    expect(screen.queryByRole("button", { name: "Download" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    const homeLink = screen.getByRole("link", { name: "Tonalli home" });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(within(homeLink).getByRole("img", { name: "Tonalli" })).toHaveAttribute(
      "src",
      expect.stringContaining("/assets/Tonalli_Logo.png"),
    );
  });

  it("opens the dropdown and closes it with Escape while restoring focus", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", { name: "Menu" });
    await user.click(menuButton);

    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    expect(mobileNavigation).toHaveTextContent("Menu item 1");
    expect(mobileNavigation).toHaveTextContent("Menu item 4");
    expect(screen.getByRole("link", { name: "Tonalli home" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(
        screen.queryByRole("navigation", { name: "Mobile navigation" }),
      ).not.toBeInTheDocument(),
    );
    expect(menuButton).toHaveFocus();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the dropdown after an outside pointer interaction", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SiteHeader />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    ));
  });
});
