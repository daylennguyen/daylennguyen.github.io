import { describe, it, expect } from "vitest";
import {
  FISH_ANIMATIONS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FISH_RENDER_SIZE,
  SPIN_COUNT,
  SPIN_DURATION_MS,
} from "../config";

describe("FishCanvas config", () => {
  it("should have required animation states", () => {
    expect(FISH_ANIMATIONS).toHaveProperty("swimming");
    expect(FISH_ANIMATIONS).toHaveProperty("idle");
  });

  it("should have valid animation frames", () => {
    Object.values(FISH_ANIMATIONS).forEach((anim) => {
      expect(anim.frames).toBeDefined();
      expect(anim.frames.length).toBeGreaterThan(0);
      expect(anim.speed).toBeGreaterThan(0);

      anim.frames.forEach((frame) => {
        expect(frame.x).toBeGreaterThanOrEqual(0);
        expect(frame.y).toBeGreaterThanOrEqual(0);
        expect(frame.width).toBeGreaterThan(0);
        expect(frame.height).toBeGreaterThan(0);
      });
    });
  });

  it("should have valid canvas dimensions", () => {
    expect(CANVAS_WIDTH).toBeGreaterThan(0);
    expect(CANVAS_HEIGHT).toBeGreaterThan(0);
    expect(FISH_RENDER_SIZE).toBeGreaterThan(0);
  });

  it("should have valid spin configuration", () => {
    expect(SPIN_COUNT).toBeGreaterThan(0);
    expect(SPIN_DURATION_MS).toBeGreaterThan(0);
  });
});
