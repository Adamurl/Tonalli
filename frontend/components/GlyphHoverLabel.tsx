"use client";

import {
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

type GlyphHoverLabelProps = {
  name: string;
  children: ReactNode;
};

export function GlyphHoverLabel({ name, children }: GlyphHoverLabelProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") {
      setPosition({ x: event.clientX, y: event.clientY });
    }
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
  }

  return (
    <div
      className="glyph-hover-target"
      role="group"
      tabIndex={0}
      aria-label={name}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPosition(null)}
      onFocus={handleFocus}
      onBlur={() => setPosition(null)}
    >
      {children}
      {position && (
        <span
          className="glyph-hover-label"
          role="tooltip"
          style={{ left: position.x, top: position.y }}
        >
          {name}
        </span>
      )}
    </div>
  );
}
