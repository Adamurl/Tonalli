"use client";

import { useEffect, useState } from "react";

import { DateNavigator } from "../components/DateNavigator";
import { DaySignSection } from "../components/DaySignSection";
import { SiteHeader } from "../components/SiteHeader";
import {
  getCalendarDate,
  localDateString,
  type CalendarDate,
} from "../lib/calendar";

export default function Home() {
  const [date, setDate] = useState("");
  const [calendar, setCalendar] = useState<CalendarDate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    setDate(localDateString(new Date()));
  }, []);

  useEffect(() => {
    if (!date) return;
    const requestedDate = date;
    const controller = new AbortController();

    setCalendar(null);
    setError(null);
    getCalendarDate(requestedDate, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setCalendar(result);
      })
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
    <main className="tonalli-page">
      <SiteHeader />
      <section className="calendar-screen" aria-busy={!calendar && !error}>
        {date && (
          <DateNavigator date={date} onChange={setDate} onShift={shiftDate} />
        )}
        <div className="calendar-content">
          {calendar ? (
            <DaySignSection sign={calendar.tonalpohualli} />
          ) : error ? (
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
        </div>
      </section>
    </main>
  );
}
