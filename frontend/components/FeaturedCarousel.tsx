"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type Slide = { title: string; subtitle: string; image: string; position?: string };

const slides: Slide[] = [
  { title: "After the Rain", subtitle: "Field Notes · 2025", image: "photo-1534528741775-53994a69daeb", position: "center 35%" },
  { title: "Open Country", subtitle: "Quiet Studio Hours", image: "photo-1500530855697-b586d89ba3ee" },
  { title: "Marrow", subtitle: "Quiet Studio Hours", image: "photo-1539109136881-3be0616acf4b", position: "center 30%" },
  { title: "Blue Hour", subtitle: "Field Notes · 2025", image: "photo-1529139574466-a303027c1d8b", position: "center 30%" },
  { title: "Soft Focus", subtitle: "Portraits in Motion", image: "photo-1524504388940-b1c1722653e1", position: "center 30%" },
  { title: "The Long Way", subtitle: "A study of stillness", image: "photo-1506794778202-cad84cf45f1d", position: "center 25%" },
  { title: "Northbound", subtitle: "Field Notes · 2025", image: "photo-1488426862026-3ee34a7d66df", position: "center 30%" },
  { title: "Still Water", subtitle: "A quieter kind of blue", image: "photo-1500534623283-312aade485b7" },
  { title: "Wild Light", subtitle: "Notes from the coast", image: "photo-1470252649378-9c29740c9fa8" },
  { title: "Last Light", subtitle: "Portraits in Motion", image: "photo-1515886657613-9f3515b0c78f", position: "center 25%" },
];

export const carouselConfig = {
  activeWidth: 392,
  inactiveRatio: 0.52,
  gap: 22,
  aspectRatio: 3 / 4,
  activeGrayscale: 0,
  inactiveGrayscale: 100,
  maxBlur: 4,
  blurStartsAt: 1,
  blurEndsAt: 2,
  spring: { stiffness: 170, damping: 28, mass: 1 },
  dragThreshold: 5,
  velocityProjection: 0.22,
} as const;

const imageUrl = (id: string, width: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

function distanceFor(index: number, position: number) {
  const count = slides.length;
  const wrapped = ((index - position + count / 2) % count + count) % count - count / 2;
  return Math.abs(wrapped);
}

function Card({
  slide,
  index,
  position,
  activeWidth,
  gap,
  onSelect,
}: {
  slide: Slide;
  index: number;
  position: ReturnType<typeof useMotionValue<number>>;
  activeWidth: number;
  gap: number;
  onSelect: (index: number) => void;
}) {
  const inactiveWidth = activeWidth * carouselConfig.inactiveRatio;
  const focus = useTransform(position, (value) => 1 - smoothstep(clamp(distanceFor(index, value), 0, 1)));
  const width = useTransform(focus, (value) => inactiveWidth + (activeWidth - inactiveWidth) * value);
  const x = useTransform(position, (value) => {
    const widthAt = (distance: number) => inactiveWidth + (activeWidth - inactiveWidth) * (1 - smoothstep(clamp(distance, 0, 1)));
    const lower = Math.floor(value);
    const upper = lower + 1;
    const fraction = value - lower;
    const lowerWidth = widthAt(fraction);
    const upperWidth = widthAt(1 - fraction);
    const pitch = (lowerWidth + upperWidth) / 2 + gap;
    const virtualIndex = index + Math.round((value - index) / slides.length) * slides.length;

    if (virtualIndex <= lower) {
      let offset = -fraction * pitch;
      for (let current = lower; current > virtualIndex; current -= 1) {
        offset -= (widthAt(Math.abs(current - value)) + widthAt(Math.abs(current - 1 - value))) / 2 + gap;
      }
      return offset;
    }

    let offset = (1 - fraction) * pitch;
    for (let current = upper; current < virtualIndex; current += 1) {
      offset += (widthAt(Math.abs(current - value)) + widthAt(Math.abs(current + 1 - value))) / 2 + gap;
    }
    return offset;
  });
  const filter = useTransform(position, (value) => {
    const distance = distanceFor(index, value);
    const focusAmount = 1 - smoothstep(clamp(distance, 0, 1));
    const blurProgress = smoothstep(clamp((distance - carouselConfig.blurStartsAt) / (carouselConfig.blurEndsAt - carouselConfig.blurStartsAt), 0, 1));
    const grayscale = carouselConfig.activeGrayscale + (carouselConfig.inactiveGrayscale - carouselConfig.activeGrayscale) * (1 - focusAmount);
    return `grayscale(${grayscale}%) blur(${blurProgress * carouselConfig.maxBlur}px)`;
  });
  const zIndex = useTransform(position, (value) => Math.round(100 - distanceFor(index, value) * 10));

  return (
    <motion.button
      className="carousel-card"
      type="button"
      data-carousel-index={index}
      style={{ width, x, filter, zIndex }}
      onClick={() => onSelect(index)}
      aria-label={`Show ${slide.title}`}
      aria-current={distanceFor(index, position.get()) < 0.5 ? "true" : undefined}
    >
      <img src={imageUrl(slide.image, 1000)} alt="" style={{ objectPosition: slide.position }} draggable="false" />
    </motion.button>
  );
}

export function FeaturedCarousel() {
  const [active, setActive] = useState(2);
  const [activeWidth, setActiveWidth] = useState(392);
  const [captionWidth, setCaptionWidth] = useState(392);
  const position = useMotionValue(2);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const animationRef = useRef<{ stop: () => void } | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startPosition: number; lastX: number; lastTime: number; velocity: number; moved: boolean; targetIndex: number | null } | null>(null);
  const suppressClickRef = useRef(false);
  const stepWidth = useMemo(() => (activeWidth * (1 + carouselConfig.inactiveRatio)) / 2 + carouselConfig.gap, [activeWidth]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const width = Math.min(carouselConfig.activeWidth, Math.max(150, (rect.width - 32) * 0.94), Math.max(150, (rect.height - 190) * carouselConfig.aspectRatio));
      setActiveWidth(width);
      setCaptionWidth(Math.min(width, rect.width - 32));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preload = [-2, -1, 0, 1, 2].map((offset) => slides[(active + offset + slides.length) % slides.length]);
    preload.forEach((slide) => {
      const image = new Image();
      image.src = imageUrl(slide.image, 1000);
    });
  }, [active]);

  const goTo = useCallback((target: number) => {
    animationRef.current?.stop();
    const current = position.get();
    const wrapped = ((target % slides.length) + slides.length) % slides.length;
    const baseTarget = Math.round(current - ((current - wrapped) % slides.length));
    const candidates = [baseTarget - slides.length, baseTarget, baseTarget + slides.length];
    const nearestTarget = candidates.reduce((best, candidate) => Math.abs(candidate - current) < Math.abs(best - current) ? candidate : best, candidates[0]);
    setActive(((nearestTarget % slides.length) + slides.length) % slides.length);
    if (prefersReducedMotion) {
      position.set(nearestTarget);
      return;
    }
    animationRef.current = animate(position, nearestTarget, { type: "spring", ...carouselConfig.spring });
  }, [position, prefersReducedMotion]);

  const finishDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) {
      goTo(drag.targetIndex ?? Math.round(position.get()));
      return;
    }
    suppressClickRef.current = true;
    window.setTimeout(() => { suppressClickRef.current = false; }, 100);
    const projected = position.get() + clamp(drag.velocity * carouselConfig.velocityProjection, -0.8, 0.8);
    goTo(Math.round(projected));
  }, [goTo, position]);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    animationRef.current?.stop();
    const targetIndex = (event.target as HTMLElement).closest<HTMLElement>("[data-carousel-index]")?.dataset.carouselIndex;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startPosition: position.get(), lastX: event.clientX, lastTime: performance.now(), velocity: 0, moved: false, targetIndex: targetIndex === undefined ? null : Number(targetIndex) };
    const target = event.target as Element & { setPointerCapture?: (pointerId: number) => void };
    target.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const now = performance.now();
    if (Math.abs(event.clientX - drag.startX) > carouselConfig.dragThreshold) drag.moved = true;
    const pxDelta = event.clientX - drag.lastX;
    const totalDelta = event.clientX - drag.startX;
    position.set(drag.startPosition - totalDelta / stepWidth);
    if (now > drag.lastTime) drag.velocity = -(pxDelta / stepWidth) / ((now - drag.lastTime) / 1000);
    drag.lastX = event.clientX;
    drag.lastTime = now;
  };

  return (
    <main className="focus-page">
      <section
        ref={containerRef}
        className="carousel"
        aria-roledescription="carousel"
        aria-label="Featured images"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
        }}
      >
        <div className="carousel__track">
          {slides.map((slide, index) => (
            <Card key={slide.title} slide={slide} index={index} position={position} activeWidth={activeWidth} gap={carouselConfig.gap} onSelect={(target) => {
              if (!suppressClickRef.current) goTo(target);
            }} />
          ))}
        </div>
        <div className="carousel-caption" style={{ width: captionWidth }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={slides[active].title} className="carousel-caption__copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.18 }} aria-live="polite">
              <span>{slides[active].title}</span>
              <span>{slides[active].subtitle}</span>
            </motion.div>
          </AnimatePresence>
          <span className="carousel-caption__marker" aria-hidden="true" />
        </div>
      </section>
    </main>
  );
}
