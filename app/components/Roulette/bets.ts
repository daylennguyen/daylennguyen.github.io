import { RED_NUMBERS } from "./config";
import type { BetKind, PlacedBet } from "./types";

/** Table layout: row 0 = 3,6,9.. row 1 = 2,5,8.. row 2 = 1,4,7.. (European layout) */
export const NUMBER_GRID = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
];

/** Returns payout multiplier for a winning bet (e.g. 35 for straight up, 1 for red/black). */
function getMultiplier(kind: BetKind): number {
  switch (kind.type) {
    case "number":
      return 35;
    case "red":
    case "black":
    case "even":
    case "odd":
    case "low":
    case "high":
      return 1;
    case "dozen":
    case "column":
      return 2;
    default:
      return 0;
  }
}

/** Check if a bet wins given the result number (0-36). */
function betWins(kind: BetKind, result: number): boolean {
  if (result === 0) {
    return kind.type === "number" && kind.value === 0;
  }
  switch (kind.type) {
    case "number":
      return kind.value === result;
    case "red":
      return RED_NUMBERS.has(result);
    case "black":
      return !RED_NUMBERS.has(result);
    case "even":
      return result % 2 === 0;
    case "odd":
      return result % 2 === 1;
    case "low":
      return result >= 1 && result <= 18;
    case "high":
      return result >= 19 && result <= 36;
    case "dozen":
      if (kind.which === 1) return result >= 1 && result <= 12;
      if (kind.which === 2) return result >= 13 && result <= 24;
      return result >= 25 && result <= 36;
    case "column":
      return (result - kind.which) % 3 === 0; // col 1: 1,4,7.. col 2: 2,5,8.. col 3: 3,6,9..
    default:
      return false;
  }
}

/** Resolve all bets; returns { profit, returnedStake } for winning bets. */
export function resolveBets(
  bets: PlacedBet[],
  result: number
): { profit: number; returnedStake: number } {
  let profit = 0;
  let returnedStake = 0;
  for (const bet of bets) {
    if (betWins(bet.kind, result)) {
      returnedStake += bet.eggs;
      profit += bet.eggs * getMultiplier(bet.kind);
    }
  }
  return { profit, returnedStake };
}
