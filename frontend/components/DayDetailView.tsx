"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { DAY_SIGN_EXPANSION_TRANSITION, DaySignArtwork } from "./DaySignSection";
import { readDayArtworkPreview, useDayTransition } from "./DayTransitionContext";
import { DAY_CONTENT_TRANSITION, DAY_REVEAL_FALLBACK_MS } from "../lib/dayTransition";
import {
  formatDisplayDate,
  getCalendarDate,
  isValidCalendarDate,
  NAHUATL_NUMBERS,
  type CalendarDate,
} from "../lib/calendar";

export function DayDetailView({
  date,
  presentation,
}: {
  date: string;
  presentation: "page" | "overlay";
}) {
  const pathname = usePathname();
  const pathnameDate = pathname?.split("/").filter(Boolean).at(-1) ?? "";
  const activeDate = isValidCalendarDate(date) ? date : pathnameDate;
  const validDate = isValidCalendarDate(activeDate);
  const prefersReducedMotion = useReducedMotion();
  const { preview, setPreview } = useDayTransition();
  const dayPreview = preview?.date === activeDate ? preview : null;
  const previewCalendar = dayPreview?.calendar ?? null;
  const [calendar, setCalendar] = useState<CalendarDate | null>(previewCalendar);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const artworkSign = calendar?.tonalpohualli ?? dayPreview?.sign ?? null;
  const isOverlay = presentation === "overlay";
  const showContent = !isOverlay || Boolean(prefersReducedMotion) || transitionComplete;
  const PageContainer = isOverlay ? "div" : "main";

  useEffect(() => {
    if (!validDate) {
      setError("This date is invalid. Use a date in YYYY-MM-DD format.");
      return;
    }

    if (previewCalendar) {
      setCalendar(previewCalendar);
      setError(null);
      return;
    }

    const storedPreview = readDayArtworkPreview(activeDate);
    if (storedPreview) {
      setPreview(storedPreview);
      if (storedPreview.calendar) {
        setCalendar(storedPreview.calendar);
        setError(null);
        return;
      }
    }

    const controller = new AbortController();
    setCalendar(null);
    setError(null);
    getCalendarDate(activeDate, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setCalendar(result);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(reason instanceof Error ? reason.message : "Could not load this day.");
      });

    return () => controller.abort();
  }, [activeDate, previewCalendar, requestCount, setPreview, validDate]);

  useEffect(() => {
    if (!isOverlay || prefersReducedMotion) return;
    const fallback = window.setTimeout(() => setTransitionComplete(true), DAY_REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [isOverlay, prefersReducedMotion]);

  const displayDate = validDate ? formatDisplayDate(activeDate) : null;

  return (
    <PageContainer
      className={`day-detail-page${isOverlay ? " day-detail-page--overlay" : ""}`}
      aria-busy={!calendar && !error}
      role={isOverlay ? "dialog" : undefined}
      aria-modal={isOverlay ? true : undefined}
      aria-label={isOverlay ? "Day details" : undefined}
    >
      {artworkSign && (
        <DaySignArtwork
          sign={artworkSign}
          date={activeDate}
          className="day-detail__art"
          imageClassName="day-detail__art-image"
          overlay={<span className="day-detail__scrim" aria-hidden="true" />}
          transition={isOverlay && !prefersReducedMotion ? DAY_SIGN_EXPANSION_TRANSITION : undefined}
          borderRadius={0}
          onLayoutAnimationComplete={() => setTransitionComplete(true)}
        />
      )}

      {showContent && (
        <motion.div
          className="day-detail__back"
          initial={isOverlay && !prefersReducedMotion ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : DAY_CONTENT_TRANSITION}
        >
          <Link href={`/?date=${encodeURIComponent(activeDate)}`}>
            Back to calendar
          </Link>
        </motion.div>
      )}

      {showContent && calendar ? (
        <motion.article
          className="day-detail__content"
          initial={isOverlay && !prefersReducedMotion ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : DAY_CONTENT_TRANSITION}
        >
          <p className="day-detail__date">
            {displayDate?.month} {displayDate?.day}, {displayDate?.year}
          </p>
          <h1>{NAHUATL_NUMBERS[calendar.tonalpohualli.number] ?? calendar.tonalpohualli.number} {calendar.tonalpohualli.sign}</h1>
          <p className="day-detail__meaning">
            Day {calendar.tonalpohualli.number} · {calendar.tonalpohualli.english}
          </p>

          <div className="day-detail__facts">
            <section aria-labelledby="trecena-heading">
              <h2 id="trecena-heading">Trecena</h2>
              <p>{calendar.trecena.number} · {calendar.trecena.sign}</p>
              <span>{calendar.trecena.english}</span>
            </section>
            <section aria-labelledby="veintena-heading">
              <h2 id="veintena-heading">Veintena</h2>
              <p>{calendar.xiuhpohualli.veintena}, day {calendar.xiuhpohualli.day}</p>
              <span>{calendar.xiuhpohualli.reference.meaning_en}</span>
            </section>
            <section aria-labelledby="xihuitl-heading">
              <h2 id="xihuitl-heading">Xihuitl</h2>
              <p>Year {calendar.xihuitl.number} · {calendar.xihuitl.sign}</p>
              <span>Solar year</span>
            </section>
          </div>
        </motion.article>
      ) : showContent && error ? (
        <div className="day-detail__message" role="alert">
          <p>{error}</p>
          {validDate && (
            <button type="button" onClick={() => setRequestCount((count) => count + 1)}>
              Try again
            </button>
          )}
        </div>
      ) : showContent ? (
        <p className="day-detail__loading" role="status">Loading this day…</p>
      ) : null}
    </PageContainer>
  );
}
