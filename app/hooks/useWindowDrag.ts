"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type WindowPosition = { x: number; y: number };

export type UseWindowDragOptions = {
  /** "translate" = position is used as transform translate(x,y). "rightTop" = position is used as CSS right/top in px. */
  mode: "translate" | "rightTop";
};

/**
 * Hook for draggable window position. Returns position state and a mousedown handler for the title bar.
 * Use mode "translate" for centered/world-positioned windows, "rightTop" for fixed right/top (e.g. fish window).
 */
export function useWindowDrag(
  initialPosition: WindowPosition,
  options: UseWindowDragOptions
): {
  position: WindowPosition;
  setPosition: React.Dispatch<React.SetStateAction<WindowPosition>>;
  isDragging: boolean;
  handleTitleBarMouseDown: (e: React.MouseEvent) => void;
} {
  const [position, setPosition] = useState<WindowPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({
    clientX: 0,
    clientY: 0,
    windowX: 0,
    windowY: 0,
  });
  const { mode } = options;

  const handleTitleBarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        windowX: position.x,
        windowY: position.y,
      };
      setIsDragging(true);
    },
    [position.x, position.y]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const start = dragStartRef.current;
      if (mode === "rightTop") {
        setPosition({
          x: start.windowX + start.clientX - e.clientX,
          y: start.windowY + e.clientY - start.clientY,
        });
      } else {
        setPosition({
          x: start.windowX + e.clientX - start.clientX,
          y: start.windowY + e.clientY - start.clientY,
        });
      }
    };
    const onMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, mode]);

  return {
    position,
    setPosition,
    isDragging,
    handleTitleBarMouseDown,
  };
}
