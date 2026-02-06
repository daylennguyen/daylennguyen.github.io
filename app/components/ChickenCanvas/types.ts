export type ChickenState = "idle" | "walking" | "hurt" | "resting";

export type ChickenFacing = "left" | "right";

export interface Chicken {
  x: number;
  targetX: number;
  frame: number;
  animTimer: number;
  facing: ChickenFacing;
  state: ChickenState;
  hurtUntil: number;
  hurtStarted: number;
  vy: number;
  yOffset: number;
  vx: number;
}

export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Animation {
  frames: SpriteFrame[];
  speed: number;
}
