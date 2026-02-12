"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react95";
import type { BetKind, PlacedBet, SpinState } from "./types";
import {
  WHEEL_SEGMENTS,
  CANVAS_SIZE,
  WHEEL_RADIUS,
  BALL_RADIUS,
  SPIN_DURATION_MS,
  SPIN_FULL_ROTATIONS,
  INITIAL_EGGS,
  RED_NUMBERS,
} from "./config";
import { NUMBER_GRID, resolveBets } from "./bets";

const SEGMENT_ANGLE = (2 * Math.PI) / WHEEL_SEGMENTS.length;
const BALL_ORBIT_RADIUS = WHEEL_RADIUS - 6;

/** Cubic ease-out: 1 - (1-t)^3 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function getBetKey(kind: BetKind): string {
  if (kind.type === "number") return `n-${kind.value}`;
  if (kind.type === "dozen") return `d-${kind.which}`;
  if (kind.type === "column") return `c-${kind.which}`;
  return kind.type;
}

function getBetEggs(placed: PlacedBet[], kind: BetKind): number {
  const key = getBetKey(kind);
  const b = placed.find((x) => getBetKey(x.kind) === key);
  return b?.eggs ?? 0;
}

function addBet(placed: PlacedBet[], kind: BetKind, eggs: number): PlacedBet[] {
  const key = getBetKey(kind);
  const i = placed.findIndex((x) => getBetKey(x.kind) === key);
  const newEggs = (i >= 0 ? placed[i].eggs : 0) + eggs;
  if (newEggs <= 0) return i >= 0 ? placed.filter((_, idx) => idx !== i) : placed;
  const entry: PlacedBet = { kind, eggs: newEggs };
  if (i >= 0) {
    const next = [...placed];
    next[i] = entry;
    return next;
  }
  return [...placed, entry];
}

export default function Roulette() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const restRotationRef = useRef(0);
  const ballAngleRef = useRef(-Math.PI / 2);
  const spinRef = useRef<SpinState>({
    spinning: false,
    startTime: 0,
    totalDurationMs: 0,
    targetRotation: 0,
    targetSegmentIndex: 0,
  });
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [eggs, setEggs] = useState(INITIAL_EGGS);
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);

  const totalPlaced = placedBets.reduce((s, b) => s + b.eggs, 0);
  const canBet = eggs > 0 && !spinning;

  const placeBet = useCallback(
    (kind: BetKind, amount: number = 1) => {
      if (!canBet || amount > eggs - totalPlaced) return;
      setPlacedBets((p) => addBet(p, kind, amount));
    },
    [canBet, eggs, totalPlaced]
  );

  const handleRoll = useCallback(() => {
    if (spinRef.current.spinning || totalPlaced === 0) return;
    if (eggs < totalPlaced) return;
    const betsToResolve = [...placedBets];
    setPlacedBets([]);
    setEggs((e) => e - totalPlaced);

    const targetSegmentIndex = Math.floor(
      Math.random() * WHEEL_SEGMENTS.length
    );
    const targetRestRotation = (targetSegmentIndex + 0.5) * SEGMENT_ANGLE;
    const rest = restRotationRef.current;
    const full = SPIN_FULL_ROTATIONS * 2 * Math.PI;
    const extra =
      ((targetRestRotation - rest - full) % (2 * Math.PI) + 2 * Math.PI) %
      (2 * Math.PI);
    const targetTotalRotation = rest + full + extra;

    const ballRest = ballAngleRef.current;
    const ballTarget = -Math.PI / 2;
    const ballFull = SPIN_FULL_ROTATIONS * 2 * Math.PI;
    const ballExtra =
      ((ballTarget - ballRest - ballFull) % (2 * Math.PI) + 2 * Math.PI) %
      (2 * Math.PI);
    const ballTargetTotal = ballRest + ballFull + ballExtra;

    spinRef.current = {
      spinning: true,
      startTime: performance.now(),
      totalDurationMs: SPIN_DURATION_MS,
      targetRotation: targetTotalRotation,
      targetSegmentIndex,
    };
    (spinRef as React.MutableRefObject<SpinState & { ballTargetTotal?: number; ballStartAngle?: number }>).current.ballTargetTotal = ballTargetTotal;
    (spinRef as React.MutableRefObject<SpinState & { ballTargetTotal?: number; ballStartAngle?: number }>).current.ballStartAngle = ballRest;
    setSpinning(true);
    setLastResult(null);

    const resultNum = parseInt(WHEEL_SEGMENTS[targetSegmentIndex].label, 10);
    const { profit, returnedStake } = resolveBets(betsToResolve, resultNum);
    setTimeout(() => {
      setEggs((e) => e + returnedStake + profit);
    }, SPIN_DURATION_MS);
  }, [placedBets, totalPlaced, eggs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const center = CANVAS_SIZE / 2;

    let animationId: number;

    const draw = (now: number) => {
      const spin = spinRef.current as SpinState & {
        ballTargetTotal?: number;
        ballStartAngle?: number;
      };
      let currentRotation = restRotationRef.current;
      let ballAngle = ballAngleRef.current;

      if (spin.spinning && spin.totalDurationMs > 0) {
        const elapsed = now - spin.startTime;
        const t = Math.min(1, elapsed / spin.totalDurationMs);
        const eased = easeOutCubic(t);
        currentRotation =
          restRotationRef.current +
          eased * (spin.targetRotation - restRotationRef.current);
        if (spin.ballStartAngle !== undefined && spin.ballTargetTotal !== undefined) {
          ballAngle = spin.ballStartAngle + eased * (spin.ballTargetTotal - spin.ballStartAngle);
          ballAngleRef.current = ballAngle;
        }
        if (t >= 1) {
          restRotationRef.current = spin.targetRotation;
          if (spin.ballTargetTotal !== undefined) ballAngleRef.current = spin.ballTargetTotal;
          spinRef.current = {
            spinning: false,
            startTime: 0,
            totalDurationMs: 0,
            targetRotation: 0,
            targetSegmentIndex: 0,
          };
          setLastResult(`Landed on: ${WHEEL_SEGMENTS[spin.targetSegmentIndex].label}`);
          setSpinning(false);
        }
      }

      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(-currentRotation);
      ctx.translate(-center, -center);

      for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
        const startAngle = -Math.PI / 2 + i * SEGMENT_ANGLE;
        const endAngle = startAngle + SEGMENT_ANGLE;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, WHEEL_RADIUS, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = WHEEL_SEGMENTS[i].color;
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.stroke();
        const labelAngle = startAngle + SEGMENT_ANGLE / 2;
        const labelRadius = WHEEL_RADIUS * 0.7;
        const tx = center + labelRadius * Math.cos(labelAngle);
        const ty = center + labelRadius * Math.sin(labelAngle);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(WHEEL_SEGMENTS[i].label, tx, ty);
      }

      ctx.restore();

      // Center spindle (yellow cross)
      const spindleR = 12;
      ctx.fillStyle = "#f5d000";
      ctx.strokeStyle = "#b8860b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center, center, spindleR, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#b8860b";
      ctx.fillRect(center - 2, center - spindleR, 4, spindleR * 2);
      ctx.fillRect(center - spindleR, center - 2, spindleR * 2, 4);

      const bx = center + BALL_ORBIT_RADIUS * Math.cos(ballAngle);
      const by = center + BALL_ORBIT_RADIUS * Math.sin(ballAngle);
      const ballGradient = ctx.createRadialGradient(
        bx - BALL_RADIUS * 0.3,
        by - BALL_RADIUS * 0.3,
        0,
        bx,
        by,
        BALL_RADIUS * 1.2
      );
      ballGradient.addColorStop(0, "#e8e8e8");
      ballGradient.addColorStop(0.5, "#c0c0c0");
      ballGradient.addColorStop(1, "#808080");
      ctx.beginPath();
      ctx.arc(bx, by, BALL_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = ballGradient;
      ctx.fill();
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1;
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="flex flex-col gap-2 p-3 min-w-[520px] w-fit">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold">Eggs: {eggs}</span>
        {lastResult && (
          <span className="text-sm font-bold tabular-nums">{lastResult}</span>
        )}
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="roulette-wheel-canvas"
          aria-label="Roulette wheel"
        />
      </div>

      <div className="roulette-board">
        <div className="roulette-board__main-grid">
          <button
            type="button"
            onClick={() => placeBet({ type: "number", value: 0 })}
            disabled={!canBet}
            className="roulette-board__cell-zero"
          >
            <span>0</span>
            {getBetEggs(placedBets, { type: "number", value: 0 }) > 0 && (
              <span className="text-[9px]">×{getBetEggs(placedBets, { type: "number", value: 0 })}</span>
            )}
          </button>
          {NUMBER_GRID.flatMap((row, ri) =>
            row.map((num, ci) => (
              <button
                key={`${ri}-${num}`}
                type="button"
                onClick={() => placeBet({ type: "number", value: num })}
                disabled={!canBet}
                className={`roulette-board__cell-number ${RED_NUMBERS.has(num) ? "roulette-board__cell-number--red" : "roulette-board__cell-number--black"}`}
                style={{ gridColumn: ci + 2, gridRow: ri + 1 }}
              >
                {num}
                {getBetEggs(placedBets, { type: "number", value: num }) > 0 && (
                  <span className="ml-0.5 text-[8px]">×{getBetEggs(placedBets, { type: "number", value: num })}</span>
                )}
              </button>
            ))
          )}
          {([1, 2, 3] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => placeBet({ type: "column", which: c })}
              disabled={!canBet}
              className="roulette-board__cell-2to1"
              style={{ gridColumn: 14, gridRow: c }}
            >
              2:1
              {getBetEggs(placedBets, { type: "column", which: c }) > 0 && (
                <span className="text-[8px]">×{getBetEggs(placedBets, { type: "column", which: c })}</span>
              )}
            </button>
          ))}
        </div>

        <div className="roulette-board__dozen-row">
          {([1, 2, 3] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => placeBet({ type: "dozen", which: d })}
              disabled={!canBet}
              className="roulette-board__btn roulette-board__btn--black"
            >
              {d === 1 ? "1 to 12" : d === 2 ? "13 to 24" : "25 to 36"}
              {getBetEggs(placedBets, { type: "dozen", which: d }) > 0 && (
                <span className="text-[9px]"> ×{getBetEggs(placedBets, { type: "dozen", which: d })}</span>
              )}
            </button>
          ))}
        </div>

        <div className="roulette-board__outside-row">
          <button
            type="button"
            onClick={() => placeBet({ type: "low" })}
            disabled={!canBet}
            className="roulette-board__btn roulette-board__btn--black"
          >
            1 to 18
            {getBetEggs(placedBets, { type: "low" }) > 0 && ` ×${getBetEggs(placedBets, { type: "low" })}`}
          </button>
          <button
            type="button"
            onClick={() => placeBet({ type: "even" })}
            disabled={!canBet}
            className="roulette-board__btn roulette-board__btn--black"
          >
            Even
            {getBetEggs(placedBets, { type: "even" }) > 0 && ` ×${getBetEggs(placedBets, { type: "even" })}`}
          </button>
          <button
            type="button"
            onClick={() => placeBet({ type: "red" })}
            disabled={!canBet}
            className="roulette-board__btn roulette-board__btn--red"
          >
            Red
            {getBetEggs(placedBets, { type: "red" }) > 0 && ` ×${getBetEggs(placedBets, { type: "red" })}`}
          </button>
          <button
            type="button"
            onClick={() => placeBet({ type: "black" })}
            disabled={!canBet}
            className="roulette-board__btn roulette-board__btn--black"
          >
            Black
            {getBetEggs(placedBets, { type: "black" }) > 0 && ` ×${getBetEggs(placedBets, { type: "black" })}`}
          </button>
          <button
            type="button"
            onClick={() => placeBet({ type: "odd" })}
            disabled={!canBet}
            className="roulette-board__btn roulette-board__btn--black"
          >
            Odd
            {getBetEggs(placedBets, { type: "odd" }) > 0 && ` ×${getBetEggs(placedBets, { type: "odd" })}`}
          </button>
          <button
            type="button"
            onClick={() => placeBet({ type: "high" })}
            disabled={!canBet}
            className="roulette-board__btn roulette-board__btn--black"
          >
            19 to 36
            {getBetEggs(placedBets, { type: "high" }) > 0 && ` ×${getBetEggs(placedBets, { type: "high" })}`}
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <Button
          onClick={handleRoll}
          disabled={spinning || totalPlaced === 0}
          primary
        >
          Spin
        </Button>
      </div>
    </div>
  );
}
