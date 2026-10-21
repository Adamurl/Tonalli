import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SiteHeader } from "../../components/SiteHeader";
import styles from "../../components/SiteHeader.module.css";

const { pathname } = vi.hoisted(() => ({ pathname: { value: "/" } }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
}));

describe("SiteHeader", () => {
  it("shows desktop navigation and the Download action without a logo", () => {
    render(<SiteHeader />);

    const desktopNavigation = screen.getByRole("navigation", {
      name: "Main navigation",
    });
    expect(desktopNavigation).toHaveTextContent("Menu item 1");
    expect(desktopNavigation).toHaveTextContent("Menu item 4");
    expect(screen.getByRole("button", { name: "Download" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("link", { name: "Tonalli home" })).not.toBeInTheDocument();
  });

  it("uses the day detail theme for the Download action", () => {
    pathname.value = "/2026-03-29";
    render(<SiteHeader />);

    expect(screen.getByRole("banner")).toHaveClass(styles.dayDetail);
    expect(screen.getByRole("button", { name: "Download" })).toHaveClass(styles.downloadButton);
    pathname.value = "/";
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
    expect(screen.getAllByRole("button", { name: "Download" })).toHaveLength(2);

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
