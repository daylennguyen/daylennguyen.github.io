"use client";

import { useEffect, useRef, useState } from "react";
import type { SpinState } from "./types";
import {
  FISH_ANIMATIONS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FISH_RENDER_SIZE,
  WATER_COLOR,
  BOB_AMPLITUDE,
  BOB_PERIOD,
  SPIN_COUNT,
  SPIN_DURATION_MS,
} from "./config";

export default function FishCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fishImgRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const mouseRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  const spinRef = useRef<SpinState>({
    spinning: false,
    startTime: 0,
    totalRotations: 0,
    totalDurationMs: 0,
  });

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = "/assets/fish.png";
    fishImgRef.current = img;
  }, []);

  const handleCanvasClick = () => {
    const now = performance.now();
    const prev = spinRef.current;
    if (prev.spinning && prev.totalDurationMs > 0) {
      spinRef.current = {
        ...prev,
        totalRotations: prev.totalRotations + SPIN_COUNT,
        totalDurationMs: prev.totalDurationMs + SPIN_DURATION_MS,
      };
    } else {
      spinRef.current = {
        spinning: true,
        startTime: now,
        totalRotations: SPIN_COUNT,
        totalDurationMs: SPIN_DURATION_MS,
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx.imageSmoothingEnabled = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      mouseRef.current.x = (e.clientX - rect.left) * scaleX;
      mouseRef.current.y = (e.clientY - rect.top) * scaleY;
    };

    canvas.addEventListener("click", handleCanvasClick);
    document.addEventListener("mousemove", handleMouseMove);

    const anim = FISH_ANIMATIONS.swimming;
    let frameIndex = 0;
    let lastFrameTime = performance.now();
    let animationId: number;
    const startTime = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - lastFrameTime) / 1000;
      if (elapsed >= anim.speed) {
        frameIndex = (frameIndex + 1) % anim.frames.length;
        lastFrameTime = now;
      }

      ctx.fillStyle = WATER_COLOR;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const frame = anim.frames[frameIndex];
      const aspect = frame.height / frame.width;
      const renderW = FISH_RENDER_SIZE;
      const renderH = renderW * aspect;
      const centerX = CANVAS_WIDTH / 2;
      const centerY = CANVAS_HEIGHT / 2;
      const drawX = centerX - renderW / 2;
      const bobOffset =
        Math.sin(((now - startTime) / 1000) * (2 * Math.PI / BOB_PERIOD)) *
        BOB_AMPLITUDE;
      const drawY = centerY - renderH / 2 + bobOffset;

      // Calculate rotation to follow cursor (add π to flip direction)
      const fishCenterY = centerY + bobOffset;
      const dx = mouseRef.current.x - centerX;
      const dy = mouseRef.current.y - fishCenterY;
      const angleToMouse = Math.atan2(dy, dx) + Math.PI;

      // Spin rotation (from clicks)
      const spin = spinRef.current;
      let spinRotation = 0;
      if (spin.spinning && spin.totalDurationMs > 0) {
        const spinElapsed = now - spin.startTime;
        const t = Math.min(1, spinElapsed / spin.totalDurationMs);
        spinRotation = t * spin.totalRotations * 2 * Math.PI;
        if (spinElapsed >= spin.totalDurationMs) {
          spinRef.current = {
            spinning: false,
            startTime: 0,
            totalRotations: 0,
            totalDurationMs: 0,
          };
        }
      }

      // Combine cursor rotation with spin rotation
      const rotation = angleToMouse + spinRotation;

      const img = fishImgRef.current;
      if (img) {
        ctx.save();
        ctx.translate(centerX, fishCenterY);
        ctx.rotate(rotation);
        ctx.translate(-renderW / 2, -renderH / 2);
        ctx.drawImage(
          img,
          frame.x,
          frame.y,
          frame.width,
          frame.height,
          0,
          0,
          renderW,
          renderH
        );
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [imageLoaded]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        imageRendering: "pixelated",
        cursor: "pointer",
      }}
    />
  );
}
