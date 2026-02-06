export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FishAnimation {
  frames: SpriteFrame[];
  speed: number;
}

export interface SpinState {
  spinning: boolean;
  startTime: number;
  totalRotations: number;
  totalDurationMs: number;
}
