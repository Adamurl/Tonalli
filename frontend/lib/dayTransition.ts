import type { Transition } from "motion/react";

// Durations are in seconds. Both directions use this single setting.
export const DAY_ARTWORK_DURATION = 0.9;

// Symmetric ease-in-out: slow at both ends, faster in the middle.
// Reversing time produces the same curve, so closing has the same pace as opening.
export const DAY_ARTWORK_TRANSITION: Transition = {
  layout: {
    type: "tween",
    duration: DAY_ARTWORK_DURATION,
    ease: [0.76, 0, 0.24, 1],
  },
};

// The back link and detail text fade in together after artwork expansion.
export const DAY_CONTENT_TRANSITION: Transition = {
  duration: 0.4,
  ease: "easeOut",
};

// Only used if Motion's completion callback does not fire.
export const DAY_REVEAL_FALLBACK_MS = DAY_ARTWORK_DURATION * 1000 + 200;
