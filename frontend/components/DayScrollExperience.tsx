"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { DaySignArtwork, DaySignSection } from "./DaySignSection";
import { SignStorySection } from "./SignStorySection";
import type { CalendarDate } from "../lib/calendar";

type Bounds = { left: number; top: number; width: number; height: number; viewportWidth: number; viewportHeight: number };
const emptyBounds: Bounds = { left: 0, top: 0, width: 0, height: 0, viewportWidth: 0, viewportHeight: 0 };

function Interpretation() {
  return (
    <section className="interpretation site-grid" aria-labelledby="interpretation-heading">
      <div className="interpretation__content site-grid">
        <h2 id="interpretation-heading">An interpretation of the date</h2>
        <div className="interpretation__copy">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    </section>
  );
}

type DayExperienceProps = { calendar: CalendarDate; controls: ReactNode };

function AnimatedDayExperience({ calendar, controls, onImageContrastChange }: DayExperienceProps & { onImageContrastChange: (coverTop: number | null) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState(emptyBounds);
  const [phase, setPhase] = useState("calendar");
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // The track supplies 2.5 viewports of travel: 1 expand, .5 hold, 1 cover.
  const expansion = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const left = useTransform(expansion, (p) => bounds.left * (1 - p));
  const top = useTransform(expansion, (p) => bounds.top * (1 - p));
  const width = useTransform(expansion, (p) => bounds.width + (bounds.viewportWidth - bounds.width) * p);
  const height = useTransform(expansion, (p) => bounds.height + (bounds.viewportHeight - bounds.height) * p);
  const borderRadius = useTransform(expansion, [0, 1], [10, 0]);
  const calendarOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
  const scrimOpacity = useTransform(expansion, [0, 1], [0, 1]);
  const panelY = useTransform(scrollYProgress, [0.6, 1], ["100%", "0%"]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextPhase = progress < 0.12 ? "calendar" : progress < 0.6 ? "image" : "interpretation";
    setPhase(nextPhase);
    // Change contrast when the moving white surface reaches the fixed header.
    const panelTop = (1 - Math.max(0, Math.min(1, (progress - 0.6) / 0.4))) * bounds.viewportHeight;
    onImageContrastChange(progress >= 0.4 ? panelTop : null);
  });

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const slot = slotRef.current;
    if (!scene || !slot) return;
    let active = true;
    function measure() {
      if (!active || !scene || !slot) return;
      const frame = scene.getBoundingClientRect();
      const anchor = slot.getBoundingClientRect();
      setBounds({ left: anchor.left - frame.left, top: anchor.top - frame.top, width: anchor.width, height: anchor.height, viewportWidth: frame.width, viewportHeight: frame.height });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    observer.observe(slot);
    measure();
    void document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);


  return (
    <div className="day-scroll-track" ref={trackRef}>
      <div className="day-scroll-scene" ref={sceneRef} data-phase={phase}>
        <motion.section className="calendar-screen site-grid" style={{ opacity: calendarOpacity }} aria-hidden={phase !== "calendar"} inert={phase !== "calendar"}>
          {controls}
          <DaySignSection sign={calendar.tonalpohualli} artwork={<div ref={slotRef} className="day-sign__art-placeholder day-sign__art-anchor" aria-hidden="true" />} />
        </motion.section>
        <motion.div className="day-scroll-art" style={{ left, top, width, height, borderRadius, visibility: bounds.width ? "visible" : "hidden" }}>
          <DaySignArtwork sign={calendar.tonalpohualli} className="day-scroll-art__image" imageClassName="day-sign__art-image" />
          <motion.div className="day-hero__scrim" style={{ opacity: scrimOpacity }} />
        </motion.div>
        <div className="day-hero site-grid" aria-hidden={phase !== "image"}>
          <motion.h2 className="day-hero__title" style={{ opacity: titleOpacity }}>{calendar.tonalpohualli.number} {calendar.tonalpohualli.sign}</motion.h2>
        </div>
        <motion.div className="interpretation-cover" style={{ y: panelY }} aria-hidden={phase !== "interpretation"}>
          <Interpretation />
        </motion.div>
      </div>
    </div>
  );
}

export function DayScrollExperience({ calendar, controls }: DayExperienceProps) {
  const reducedMotion = useReducedMotion();
  const experienceRef = useRef<HTMLDivElement>(null);
  const imageCoverTop = useRef<number | null>(null);
  const updateContrast = useCallback(() => {
    const header = document.querySelector("header")?.getBoundingClientRect();
    const headerY = header ? header.top + header.height / 2 : 35;
    const surfaces = experienceRef.current?.querySelectorAll<HTMLElement>('[data-header-surface="image"]');
    const surfaceAtHeader = Array.from(surfaces ?? []).some((surface) => {
      const bounds = surface.getBoundingClientRect();
      return bounds.top <= headerY && bounds.bottom > headerY;
    });
    const expandedImageAtHeader = imageCoverTop.current !== null && imageCoverTop.current > headerY;
    document.documentElement.dataset.dayScene = surfaceAtHeader || expandedImageAtHeader ? "image" : "light";
  }, []);
  const onImageContrastChange = useCallback((coverTop: number | null) => {
    imageCoverTop.current = coverTop;
    updateContrast();
  }, [updateContrast]);

  useLayoutEffect(() => {
    let frame = 0;
    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateContrast);
    }
    imageCoverTop.current = null;
    updateContrast();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      delete document.documentElement.dataset.dayScene;
    };
  }, [reducedMotion, updateContrast]);

  return (
    <div ref={experienceRef}>
      {reducedMotion ? (
        <div className="day-experience--reduced">
          <section className="calendar-screen site-grid">{controls}<DaySignSection sign={calendar.tonalpohualli} /></section>
          <section className="day-hero site-grid" aria-label="Day image" data-header-surface="image">
            <DaySignArtwork sign={calendar.tonalpohualli} className="day-hero__image" imageClassName="day-sign__art-image" />
            <div className="day-hero__scrim" />
            <h2 className="day-hero__title">{calendar.tonalpohualli.number} {calendar.tonalpohualli.sign}</h2>
          </section>
          <Interpretation />
        </div>
      ) : <AnimatedDayExperience calendar={calendar} controls={controls} onImageContrastChange={onImageContrastChange} />}
      <SignStorySection sign={calendar.day_sign} />
    </div>
  );
}
