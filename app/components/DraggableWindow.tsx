"use client";

import { Window, WindowHeader, WindowContent, Button } from "react95";
import { useWindowDrag, type WindowPosition } from "../hooks/useWindowDrag";

export type DraggableWindowProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialPosition: WindowPosition;
  /** "translate" for centered windows, "rightTop" for fixed right/top positioning */
  positionMode?: "translate" | "rightTop";
  /** Optional className for WindowContent */
  contentClassName?: string;
};

export default function DraggableWindow({
  title,
  isOpen,
  onClose,
  children,
  initialPosition,
  positionMode = "translate",
  contentClassName,
}: DraggableWindowProps) {
  const { position, isDragging, handleTitleBarMouseDown } = useWindowDrag(
    initialPosition,
    { mode: positionMode }
  );

  if (!isOpen) return null;

  const containerStyle =
    positionMode === "rightTop"
      ? {
          right: `${position.x}px`,
          top: `${position.y}px`,
        }
      : {
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        };

  return (
    <div className="w-fit fixed z-30" style={containerStyle}>
      <Window shadow>
        <WindowHeader
          active
          className={`flex items-center justify-between select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleTitleBarMouseDown}
        >
          <span className="text-left">{title}</span>
          <Button
            variant="thin"
            size="sm"
            square
            className="!h-[27px] !w-[27px] !min-w-[27px] !p-0 flex items-center justify-center shrink-0 cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <span aria-hidden className="text-base leading-none">
              ×
            </span>
          </Button>
        </WindowHeader>
        <WindowContent className={contentClassName}>{children}</WindowContent>
      </Window>
    </div>
  );
}
