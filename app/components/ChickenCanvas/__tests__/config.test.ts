import { describe, it, expect } from "vitest";
import {
  CHICKEN_ANIMATIONS,
  BLOCK_TEXTURES,
  BLOCK_SIZE,
  CHICKEN_SIZE,
  NAMETAG_TEXT,
} from "../config";

describe("ChickenCanvas config", () => {
  it("should have all required animation states", () => {
    expect(CHICKEN_ANIMATIONS).toHaveProperty("stand");
    expect(CHICKEN_ANIMATIONS).toHaveProperty("walking");
    expect(CHICKEN_ANIMATIONS).toHaveProperty("hurt");
    expect(CHICKEN_ANIMATIONS).toHaveProperty("resting");
  });

  it("should have valid animation frames", () => {
    Object.values(CHICKEN_ANIMATIONS).forEach((anim) => {
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

  it("should have valid block textures", () => {
    expect(BLOCK_TEXTURES).toHaveProperty("grass");
    expect(BLOCK_TEXTURES).toHaveProperty("dirt");

    Object.values(BLOCK_TEXTURES).forEach((texture) => {
      expect(texture.x).toBeGreaterThanOrEqual(0);
      expect(texture.y).toBeGreaterThanOrEqual(0);
      expect(texture.width).toBeGreaterThan(0);
      expect(texture.height).toBeGreaterThan(0);
    });
  });

  it("should have positive block and chicken sizes", () => {
    expect(BLOCK_SIZE).toBeGreaterThan(0);
    expect(CHICKEN_SIZE).toBeGreaterThan(0);
  });

  it("should have a nametag text defined", () => {
    expect(NAMETAG_TEXT).toBeTruthy();
    expect(typeof NAMETAG_TEXT).toBe("string");
  });
});
