"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import tonalliLogo from "../assets/Tonalli_Logo.png";
import styles from "./SiteHeader.module.css";

const navigationItems = ["Menu item 1", "Menu item 2", "Menu item 3", "Menu item 4"];

export function SiteHeader() {
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
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
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
      className={styles.header}
      ref={headerRef}
    >
      <div className={`${styles.pill} glass-surface`}>
        <a className={styles.wordmark} href="/" aria-label="Tonalli home">
          <Image className={styles.logo} src={tonalliLogo} alt="Tonalli" sizes="80px" />
        </a>
        <nav className={styles.desktopNavigation} aria-label="Main navigation">
          {navigationItems.map((item) => (
            <span className={styles.navigationItem} key={item}>
              {item}
            </span>
          ))}
        </nav>

        <button
          className={styles.menuButton}
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
      </div>

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
          </nav>
        </div>
      )}
    </header>
  );
}
