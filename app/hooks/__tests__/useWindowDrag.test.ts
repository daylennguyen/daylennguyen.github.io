import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useWindowDrag } from "../useWindowDrag";

describe("useWindowDrag", () => {
  it("should initialize with the given position", () => {
    const { result } = renderHook(() =>
      useWindowDrag({ x: 100, y: 200 }, { mode: "translate" })
    );

    expect(result.current.position).toEqual({ x: 100, y: 200 });
    expect(result.current.isDragging).toBe(false);
  });

  it("should update position when setPosition is called", () => {
    const { result } = renderHook(() =>
      useWindowDrag({ x: 0, y: 0 }, { mode: "translate" })
    );

    act(() => {
      result.current.setPosition({ x: 50, y: 100 });
    });

    expect(result.current.position).toEqual({ x: 50, y: 100 });
  });

  it("should set isDragging to true when handleTitleBarMouseDown is called", () => {
    const { result } = renderHook(() =>
      useWindowDrag({ x: 0, y: 0 }, { mode: "translate" })
    );

    const mockEvent = {
      target: document.createElement("div"),
      clientX: 100,
      clientY: 200,
      preventDefault: () => {},
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleTitleBarMouseDown(mockEvent);
    });

    expect(result.current.isDragging).toBe(true);
  });

  it("should not start dragging if a button was clicked", () => {
    const { result } = renderHook(() =>
      useWindowDrag({ x: 0, y: 0 }, { mode: "translate" })
    );

    const button = document.createElement("button");
    const mockEvent = {
      target: button,
      clientX: 100,
      clientY: 200,
      preventDefault: () => {},
    } as unknown as React.MouseEvent;

    // Mock closest to return the button
    button.closest = () => button;

    act(() => {
      result.current.handleTitleBarMouseDown(mockEvent);
    });

    expect(result.current.isDragging).toBe(false);
  });
});
