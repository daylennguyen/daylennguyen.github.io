import { describe, it, expect } from "vitest";
import { formatTime } from "../formatTime";

describe("formatTime", () => {
  it("should format time in 12-hour format with AM", () => {
    const date = new Date("2024-01-01T09:30:00");
    const result = formatTime(date);
    // Result should match the format from toLocaleTimeString
    expect(result).toMatch(/9:30\s*AM/i);
  });

  it("should format time in 12-hour format with PM", () => {
    const date = new Date("2024-01-01T15:45:00");
    const result = formatTime(date);
    expect(result).toMatch(/3:45\s*PM/i);
  });

  it("should format midnight as 12 AM", () => {
    const date = new Date("2024-01-01T00:00:00");
    const result = formatTime(date);
    expect(result).toMatch(/12:00\s*AM/i);
  });

  it("should format noon as 12 PM", () => {
    const date = new Date("2024-01-01T12:00:00");
    const result = formatTime(date);
    expect(result).toMatch(/12:00\s*PM/i);
  });

  it("should pad minutes with zero when needed", () => {
    const date = new Date("2024-01-01T10:05:00");
    const result = formatTime(date);
    expect(result).toMatch(/10:05\s*AM/i);
  });
});
