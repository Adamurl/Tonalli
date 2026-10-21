import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";

import { useDayTransition } from "./DayTransitionContext";
import { DAY_ARTWORK_TRANSITION } from "../lib/dayTransition";
import acatl from "../assets/Backgrounds/BG_Acatl.jpg";
import atl from "../assets/Backgrounds/BG_Atl.jpg";
import calli from "../assets/Backgrounds/BG_Calli.jpg";
import cipactli from "../assets/Backgrounds/BG_Cipactli.jpg";
import coatl from "../assets/Backgrounds/BG_Coatl.jpg";
import cozcacuauhtli from "../assets/Backgrounds/BG_Cozcacuauhtli.jpg";
import cuauhtli from "../assets/Backgrounds/BG_Cuauhtli.jpg";
import cuetzpalin from "../assets/Backgrounds/BG_Cuetzpalin.jpg";
import ehecatl from "../assets/Backgrounds/BG_Ehecatl.jpg";
import itzcuintli from "../assets/Backgrounds/BG_Itzcuintli.jpg";
import malinalli from "../assets/Backgrounds/BG_Malinalli.jpg";
import mazatl from "../assets/Backgrounds/BG_Mazatl.jpg";
import miquiztli from "../assets/Backgrounds/BG_Miquiztli.jpg";
import ocelotl from "../assets/Backgrounds/BG_Ocelotl.jpg";
import ollin from "../assets/Backgrounds/BG_Ollin.jpg";
import ozomahtli from "../assets/Backgrounds/BG_Ozomahtli.jpg";
import quiahuitl from "../assets/Backgrounds/BG_Quiahuitl.jpg";
import tecpatl from "../assets/Backgrounds/BG_Tecpatl.jpg";
import tochtli from "../assets/Backgrounds/BG_Tochtli.jpg";
import xochitl from "../assets/Backgrounds/BG_Xochitl.jpg";

import { NAHUATL_NUMBERS, type CalendarDate, type TonalpohualliDate } from "../lib/calendar";

const DAY_SIGN_BACKGROUNDS: Record<string, StaticImageData> = {
  Acatl: acatl,
  Atl: atl,
  Calli: calli,
  Cipactli: cipactli,
  Coatl: coatl,
  Cozcacuauhtli: cozcacuauhtli,
  Cuauhtli: cuauhtli,
  Cuetzpalin: cuetzpalin,
  Ehecatl: ehecatl,
  Itzcuintli: itzcuintli,
  Malinalli: malinalli,
  Mazatl: mazatl,
  Miquiztli: miquiztli,
  Ocelotl: ocelotl,
  Ollin: ollin,
  Ozomahtli: ozomahtli,
  Quiahuitl: quiahuitl,
  Tecpatl: tecpatl,
  Tochtli: tochtli,
  Xochitl: xochitl,
};

export const DAY_SIGN_LAYOUT_TRANSITION = DAY_ARTWORK_TRANSITION;
export const DAY_SIGN_EXPANSION_TRANSITION = DAY_ARTWORK_TRANSITION;

export function DaySignArtwork({
  sign,
  date,
  className,
  imageClassName,
  overlay,
  transition,
  borderRadius,
  onLayoutAnimationComplete,
}: {
  sign: TonalpohualliDate;
  date: string;
  className: string;
  imageClassName: string;
  overlay?: ReactNode;
  transition?: Transition;
  borderRadius?: number;
  onLayoutAnimationComplete?: () => void;
}) {
  const background = DAY_SIGN_BACKGROUNDS[sign.sign];
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      layoutId={prefersReducedMotion ? undefined : `day-art-${date}`}
      transition={transition ?? { type: "spring", stiffness: 110, damping: 24, mass: 0.9 }}
      style={borderRadius === undefined ? undefined : { borderRadius }}
      onLayoutAnimationComplete={onLayoutAnimationComplete}
      role="img"
      aria-label={background ? `${sign.sign} day sign artwork` : `${sign.sign} day sign artwork placeholder`}
    >
      {background && (
        <Image
          className={imageClassName}
          src={background}
          alt=""
          fill
          sizes={className.includes("day-sign__") ? "12rem" : "100vw"}
          priority
          placeholder="blur"
        />
      )}
      {overlay}
    </motion.div>
  );
}

export function DaySignSection({
  sign,
  date,
  calendar,
}: {
  sign: TonalpohualliDate;
  date: string;
  calendar?: CalendarDate;
}) {
  const numberName = NAHUATL_NUMBERS[sign.number];
  const { setPreview } = useDayTransition();
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "touch") {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    }
  }

  function handleFocus(event: FocusEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setCursorPosition({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
  }

  function openDayDetails() {
    setPreview({ date, sign, calendar });
  }

  return (
    <section className="day-sign" aria-label="Today’s Tonalpohualli sign">
      <div className="day-sign__composition">
        <div className="day-sign__title-row">
          <Link
            className="day-sign__word-link"
            href={`/${date}`}
            aria-label={`Open day ${sign.number} details for ${date}`}
            onClick={openDayDetails}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setCursorPosition(null)}
            onFocus={handleFocus}
            onBlur={() => setCursorPosition(null)}
          >
            <span className="day-sign__word day-sign__word--number" aria-label={numberName || String(sign.number)}>
              {numberName}
            </span>
          </Link>
          <Link
            className="day-sign__art-link"
            href={`/${date}`}
            aria-label={`Open ${sign.sign} day details for ${date}`}
            onClick={openDayDetails}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setCursorPosition(null)}
            onFocus={handleFocus}
            onBlur={() => setCursorPosition(null)}
          >
            <DaySignArtwork
              sign={sign}
              date={date}
              className="day-sign__art-placeholder"
              imageClassName="day-sign__art-image"
              transition={prefersReducedMotion ? undefined : DAY_SIGN_LAYOUT_TRANSITION}
              borderRadius={10}
            />
          </Link>
          <Link
            className="day-sign__word-link"
            href={`/${date}`}
            aria-label={`Open ${sign.sign} day-sign details for ${date}`}
            onClick={openDayDetails}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setCursorPosition(null)}
            onFocus={handleFocus}
            onBlur={() => setCursorPosition(null)}
          >
            <h1 className="day-sign__word" aria-label={numberName ? `${numberName} ${sign.sign}` : sign.sign}>
              {sign.sign}
            </h1>
          </Link>
        </div>
        <div className="day-sign__translations">
          <p>{sign.number}</p>
          <span aria-hidden="true" />
          <p>{sign.english}</p>
        </div>
      </div>
      <AnimatePresence>
        {cursorPosition && (
          <motion.span
            className="day-sign__cursor-label glass-surface"
            role="tooltip"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.86 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: "easeOut" }}
            style={{ left: cursorPosition.x, top: cursorPosition.y }}
          >
            Learn More
          </motion.span>
        )}
      </AnimatePresence>
    </section>
  );
}
