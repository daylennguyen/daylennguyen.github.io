"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Button } from "react95";
import { formatTime } from "../lib/formatTime";
import StartMenu from "./StartMenu";

export type TaskbarButton = {
  label: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
};

export type TaskbarProps = {
  buttons: TaskbarButton[];
  onFishyClick?: () => void;
  onRouletteClick?: () => void;
};

export default function Taskbar({
  buttons,
  onFishyClick,
  onRouletteClick,
}: TaskbarProps) {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  const handleFishyClick = () => {
    onFishyClick?.();
    setStartMenuOpen(false);
  };

  const handleRouletteClick = () => {
    onRouletteClick?.();
    setStartMenuOpen(false);
  };

  return (
    <AppBar position="relative" className="z-20 shrink-0 overflow-visible">
      <Toolbar className="w-full justify-between overflow-visible">
        <div className="flex items-center gap-1 overflow-visible">
          <StartMenu
            isOpen={startMenuOpen}
            onToggle={() => setStartMenuOpen(!startMenuOpen)}
            onClose={() => setStartMenuOpen(false)}
            onFishyClick={handleFishyClick}
            onRouletteClick={handleRouletteClick}
          />
          {buttons.map((button, i) => (
            <Button
              key={i}
              variant="menu"
              size="sm"
              active={button.active}
              onClick={button.onClick}
            >
              {button.icon && `${button.icon} `}
              {button.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center px-2 text-sm font-bold tabular-nums">
          {time}
        </div>
      </Toolbar>
    </AppBar>
  );
}
