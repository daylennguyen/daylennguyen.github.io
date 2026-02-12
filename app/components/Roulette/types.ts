export interface WheelSegment {
  label: string;
  color: string;
}

export interface SpinState {
  spinning: boolean;
  startTime: number;
  totalDurationMs: number;
  /** Final rotation in radians (absolute). Wheel rotates so this angle is at the pointer when done. */
  targetRotation: number;
  /** Segment index we're landing on (0-based). */
  targetSegmentIndex: number;
}

/** Bet types for the table. */
export type BetKind =
  | { type: "number"; value: number }
  | { type: "red" }
  | { type: "black" }
  | { type: "even" }
  | { type: "odd" }
  | { type: "low" }   // 1-18
  | { type: "high" }  // 19-36
  | { type: "dozen"; which: 1 | 2 | 3 }   // 1-12, 13-24, 25-36
  | { type: "column"; which: 1 | 2 | 3 }; // columns 2:1

export interface PlacedBet {
  kind: BetKind;
  eggs: number;
}
