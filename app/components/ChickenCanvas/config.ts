import type { Animation, SpriteFrame } from "./types";

export const CHICKEN_ANIMATIONS: Record<string, Animation> = {
  stand: {
    frames: [
      { x: 59, y: 160, width: 160, height: 160 },
      { x: 289, y: 160, width: 160, height: 160 },
      { x: 509, y: 160, width: 160, height: 160 },
    ],
    speed: 0.7,
  },
  walking: {
    frames: [
      { x: 59, y: 440, width: 160, height: 160 },
      { x: 279, y: 440, width: 160, height: 160 },
      { x: 509, y: 440, width: 160, height: 160 },
    ],
    speed: 0.2,
  },
  hurt: {
    frames: [
      { x: 49, y: 750, width: 160, height: 160 },
      { x: 279, y: 750, width: 160, height: 160 },
    ],
    speed: 0.25,
  },
  resting: {
    frames: [{ x: 49, y: 999, width: 175, height: 175 }],
    speed: 1,
  },
};

export const BLOCK_TEXTURES: Record<string, SpriteFrame> = {
  grass: { x: 2, y: 2, width: 16, height: 16 },
  dirt: { x: 21, y: 2, width: 16, height: 16 },
};

export const BLOCK_SIZE = 48;
export const CHICKEN_SIZE = 80;

export const NAMETAG_TEXT = "Daylen";
export const NAMETAG_FONT = "14px sans-serif";
export const NAMETAG_PADDING_X = 6;
export const NAMETAG_PADDING_Y = 2;
export const NAMETAG_OFFSET_ABOVE = 8;

export const HURT_DURATION_MS = 500;
export const GRAVITY = 0.35;
export const IMPULSE_UP = -11;
export const IMPULSE_BACK = 6;
export const AIR_FRICTION = 0.98;
