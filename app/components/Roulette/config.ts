import type { WheelSegment } from "./types";

/**
 * European roulette: red numbers (rest are black). Used for Red/Black bets.
 */
export const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

/**
 * European roulette wheel order (clockwise from the 0 pocket).
 */
const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

function buildSegments(): WheelSegment[] {
  return WHEEL_ORDER.map((num) => {
    const label = num.toString();
    const color =
      num === 0
        ? "#0d7d3a" // green (single zero)
        : RED_NUMBERS.has(num)
          ? "#c41e3a" // red
          : "#1a1a1a"; // black
    return { label, color };
  });
}

export const WHEEL_SEGMENTS: WheelSegment[] = buildSegments();

export const CANVAS_SIZE = 280;
export const WHEEL_RADIUS = 105;
export const BALL_RADIUS = 10;
export const SPIN_DURATION_MS = 3000;
/** Full rotations before landing (at least 4 for a satisfying spin). */
export const SPIN_FULL_ROTATIONS = 5;

/** Starting egg balance for betting. */
export const INITIAL_EGGS = 100;
