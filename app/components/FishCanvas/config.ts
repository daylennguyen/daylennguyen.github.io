import type { FishAnimation } from "./types";

export const FISH_ANIMATIONS: Record<string, FishAnimation> = {
  swimming: {
    frames: [
      { x: 49, y: 62, width: 142, height: 122 },
      { x: 217, y: 62, width: 141, height: 122 },
      { x: 385, y: 62, width: 142, height: 122 },
      { x: 557, y: 62, width: 142, height: 122 },
    ],
    speed: 0.4,
  },
  idle: {
    frames: [
      { x: 175, y: 584, width: 142, height: 121 },
      { x: 404, y: 584, width: 126, height: 122 },
    ],
    speed: 0.6,
  },
};

export const CANVAS_WIDTH = 200;
export const CANVAS_HEIGHT = 160;
export const FISH_RENDER_SIZE = 100;
export const WATER_COLOR = "#3b9fcc";
export const BOB_AMPLITUDE = 8;
export const BOB_PERIOD = 2;
export const SPIN_COUNT = 1;
export const SPIN_DURATION_MS = 500;
