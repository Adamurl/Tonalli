"use client";

import { useEffect, useState } from "react";

import { DateNavigator } from "../components/DateNavigator";
import { DaySignSection } from "../components/DaySignSection";
import { SignGlyph } from "../components/SignGlyph";
import { TrecenaPanel } from "../components/TrecenaPanel";
import { XihuitlPanel } from "../components/XihuitlPanel";
import {
  formatDisplayDate,
  getCalendarDate,
  localDateString,
  type CalendarDate,
} from "../lib/calendar";

function CalendarComposition({
  data,
  date,
}: {
  data: CalendarDate;
  date: string;
}) {
  const displayDate = formatDisplayDate(date);

  return (
    <div className="calendar-composition">
      <time className="calendar-date" dateTime={date}>
        <span>{displayDate.month}</span>
        <span>{displayDate.day}</span>
        <span>{displayDate.year}</span>
      </time>

      <DaySignSection sign={data.tonalpohualli} />

      <div className="period-panels">
        <TrecenaPanel sign={data.trecena} />
        <XihuitlPanel sign={data.xihuitl} />
      </div>
    </div>
  );
}

export default function Home() {
  const [date, setDate] = useState<string | null>(null);
  const [calendar, setCalendar] = useState<CalendarDate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const requestedDate = date ?? localDateString(new Date());
    const controller = new AbortController();

    setCalendar(null);
    setError(null);
    if (!date) setDate(requestedDate);

    getCalendarDate(requestedDate, controller.signal)
      .then(setCalendar)
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          reason instanceof Error ? reason.message : "Could not load the calendar.",
        );
      });

    return () => controller.abort();
  }, [date, requestCount]);

  function shiftDate(days: number) {
    if (!date) return;
    const [year, month, day] = date.split("-").map(Number);
    setDate(localDateString(new Date(year, month - 1, day + days)));
  }

  return (
    <main className="calendar-screen" aria-busy={!calendar && !error}>
      {date && (
        <DateNavigator date={date} onChange={setDate} onShift={shiftDate} />
      )}
      <div className="calendar-content">
        {calendar && date ? (
          <CalendarComposition data={calendar} date={date} />
        ) : (
          <section className="calendar-loading" aria-live="polite">
            <SignGlyph size="hero" />
            {error ? (
              <div className="calendar-message" role="alert">
                <p>{error}</p>
                <button type="button" onClick={() => setRequestCount((value) => value + 1)}>
                  Try again
                </button>
              </div>
            ) : (
              <p className="calendar-loading__label" role="status">
                Reading today’s calendar…
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
