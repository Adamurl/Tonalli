"use client";

import { LayoutGroup } from "motion/react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import type { CalendarDate, TonalpohualliDate } from "../lib/calendar";

type DayArtworkPreview = {
  date: string;
  sign: TonalpohualliDate;
  calendar?: CalendarDate;
};

const PREVIEW_STORAGE_KEY = "tonalli:day-artwork-preview";

function isDayArtworkPreview(value: unknown): value is DayArtworkPreview {
  if (!value || typeof value !== "object") return false;
  const preview = value as Partial<DayArtworkPreview>;
  return (
    typeof preview.date === "string" &&
    typeof preview.sign === "object" && preview.sign !== null &&
    typeof preview.sign.number === "number" &&
    typeof preview.sign.sign === "string" &&
    typeof preview.sign.english === "string" &&
    (preview.calendar === undefined || preview.calendar?.date === preview.date)
  );
}

export function readDayArtworkPreview(date: string): DayArtworkPreview | null {
  if (typeof window === "undefined") return null;

  try {
    const rawPreview = window.sessionStorage.getItem(PREVIEW_STORAGE_KEY);
    if (!rawPreview) return null;
    const preview: unknown = JSON.parse(rawPreview);
    return isDayArtworkPreview(preview) && preview.date === date ? preview : null;
  } catch {
    return null;
  }
}
type DayTransitionState = {
  preview: DayArtworkPreview | null;
  setPreview: (preview: DayArtworkPreview | null) => void;
};

const DayTransitionContext = createContext<DayTransitionState>({
  preview: null,
  setPreview: () => {},
});

export function DayTransitionProvider({ children }: { children: ReactNode }) {
  const [preview, setPreviewState] = useState<DayArtworkPreview | null>(null);
  const setPreview = useCallback((nextPreview: DayArtworkPreview | null) => {
    setPreviewState(nextPreview);
    try {
      if (nextPreview) {
        window.sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(nextPreview));
      } else {
        window.sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
      }
    } catch {
      // The in-memory preview still supports navigation when storage is unavailable.
    }
  }, []);

  return (
    <DayTransitionContext.Provider value={{ preview, setPreview }}>
      <LayoutGroup id="day-sign-artwork">{children}</LayoutGroup>
    </DayTransitionContext.Provider>
  );
}

export function useDayTransition() {
  return useContext(DayTransitionContext);
}
