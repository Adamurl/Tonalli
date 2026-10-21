"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import styles from "./SiteHeader.module.css";

const navigationItems = ["Menu item 1", "Menu item 2", "Menu item 3", "Menu item 4"];

export function SiteHeader() {
  const pathname = usePathname();
  const isDayDetail = Boolean(pathname && pathname !== "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`${styles.header}${isDayDetail ? ` ${styles.dayDetail}` : ""}`}
      ref={headerRef}
    >
      <nav className={`${styles.desktopNavigation} glass-surface`} aria-label="Main navigation">
        {navigationItems.map((item) => (
          <span className={styles.navigationItem} key={item}>
            {item}
          </span>
        ))}
      </nav>

      <button className={styles.downloadButton} type="button">
        Download
      </button>

      <button
        className={`${styles.menuButton} glass-surface`}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
        ref={menuButtonRef}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span>{menuOpen ? "Close" : "Menu"}</span>
      </button>

      {menuOpen && (
        <div className={styles.menuLayer}>
          <nav
            className={`${styles.mobileNavigation} glass-surface`}
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            <ul className={styles.mobileNavigationList}>
              {navigationItems.map((item) => (
                <li className={styles.mobileNavigationItem} key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className={styles.mobileNavigationFooter}>
              <button className={styles.mobileDownloadButton} type="button">
                Download
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
