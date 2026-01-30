"use client";

import { useEffect, useRef, useState } from "react";
import ChickenCanvas from "./components/ChickenCanvas";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  AppBar,
  Toolbar,
  ProgressBar,
  Anchor,
  MenuList,
  MenuListItem,
} from "react95";

const GITHUB_URL = "https://github.com/daylennguyen";
const REPO_URL = "https://github.com/daylennguyen/daylennguyen.github.io";
const LOADING_DURATION_MS = 3000;

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [windowOpen, setWindowOpen] = useState(true);
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ clientX: 0, clientY: 0, windowX: 0, windowY: 0 });
  const [howWindowOpen, setHowWindowOpen] = useState(false);
  const [howWindowPosition, setHowWindowPosition] = useState({ x: 80, y: 60 });
  const [isDraggingHow, setIsDraggingHow] = useState(false);
  const dragStartHowRef = useRef({ clientX: 0, clientY: 0, windowX: 0, windowY: 0 });
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(100, (elapsed / LOADING_DURATION_MS) * 100);
      setLoadProgress(progress);
      if (progress < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setLoading(false);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      setWindowPosition({
        x: dragStartRef.current.windowX + e.clientX - dragStartRef.current.clientX,
        y: dragStartRef.current.windowY + e.clientY - dragStartRef.current.clientY,
      });
    };
    const onMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDraggingHow) return;
    const onMouseMove = (e: MouseEvent) => {
      setHowWindowPosition({
        x: dragStartHowRef.current.windowX + e.clientX - dragStartHowRef.current.clientX,
        y: dragStartHowRef.current.windowY + e.clientY - dragStartHowRef.current.clientY,
      });
    };
    const onMouseUp = () => setIsDraggingHow(false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDraggingHow]);

  useEffect(() => {
    if (!startMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target as Node)) {
        setStartMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [startMenuOpen]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      windowX: windowPosition.x,
      windowY: windowPosition.y,
    };
    setIsDragging(true);
  };

  const handleHowTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    dragStartHowRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      windowX: howWindowPosition.x,
      windowY: howWindowPosition.y,
    };
    setIsDraggingHow(true);
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[rgb(0,128,129)]"
        aria-busy="true"
        aria-label="Loading"
      >
        <Window shadow className="w-full max-w-md mx-4">
          <WindowHeader active>Daylen</WindowHeader>
          <WindowContent>
            <p className="mb-4">loading really cool stuff</p>
            <ProgressBar variant="tile" value={Math.round(loadProgress)} />
          </WindowContent>
        </Window>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <AppBar position="relative" className="z-20 shrink-0 overflow-visible">
        <Toolbar className="w-full justify-between overflow-visible">
          <div className="flex items-center gap-1 overflow-visible" ref={startMenuRef}>
            <div className="relative inline-block overflow-visible">
              <Button
                variant="menu"
                size="sm"
                active={startMenuOpen}
                onClick={() => setStartMenuOpen(!startMenuOpen)}
              >
                Start
              </Button>
              {startMenuOpen && (
                <div className="absolute left-0 top-full z-[100] mt-1 min-w-[140px]">
                  <MenuList shadow className="!relative min-w-[140px]">
                    <MenuListItem onClick={() => setStartMenuOpen(false)}>
                      Kitty
                    </MenuListItem>
                    <MenuListItem onClick={() => setStartMenuOpen(false)}>
                      Fishy
                    </MenuListItem>
                  </MenuList>
                </div>
              )}
            </div>
            <Button
              variant="menu"
              size="sm"
              active={windowOpen}
              onClick={() => setWindowOpen(true)}
            >
              🧙 Daylen
            </Button>
            <Button
              variant="menu"
              size="sm"
              active={howWindowOpen}
              onClick={() => setHowWindowOpen(true)}
            >
              About
            </Button>
          </div>
          <div className="flex items-center px-2 text-sm font-bold tabular-nums">
            {time}
          </div>
        </Toolbar>
      </AppBar>
      <div className="flex flex-1 items-center justify-center p-4 pt-2">
        <main className="relative z-10 w-fit max-w-[min(100%,42rem)]">
          {windowOpen && (
            <div
              className="w-fit"
              style={{
                transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
              }}
            >
              <Window shadow>
                <WindowHeader
                  active
                  className={`flex items-center justify-between select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                  onMouseDown={handleTitleBarMouseDown}
                >
                <span className="text-left">Daylen Nguyen</span>
                <Button
                  variant="thin"
                  size="sm"
                  square
                  className="!h-[27px] !w-[27px] !min-w-[27px] !p-0 flex items-center justify-center shrink-0 cursor-pointer"
                  onClick={() => setWindowOpen(false)}
                  aria-label="Close"
                >
                  <span aria-hidden className="text-base leading-none">×</span>
                </Button>
              </WindowHeader>
              <WindowContent className="">
                <div className="flex flex-col gap-6 py-2 items-center text-center">
                  <p className="text-lg leading-relaxed">
                    Welcome to my small slice of the internet 🧙🏻‍♂️
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      primary
                      onClick={() =>
                        window.open(GITHUB_URL, "_blank", "noopener,noreferrer")
                      }
                    >
                      GitHub
                    </Button>
                  </div>
                </div>
              </WindowContent>
            </Window>
            </div>
          )}
          {howWindowOpen && (
            <div
              className="w-fit fixed z-30"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${howWindowPosition.x}px), calc(-50% + ${howWindowPosition.y}px))`,
              }}
            >
              <Window shadow>
                <WindowHeader
                  active
                  className={`flex items-center justify-between select-none ${isDraggingHow ? "cursor-grabbing" : "cursor-grab"}`}
                  onMouseDown={handleHowTitleBarMouseDown}
                >
                  <span className="text-left">How this page is made</span>
                  <Button
                    variant="thin"
                    size="sm"
                    square
                    className="!h-[27px] !w-[27px] !min-w-[27px] !p-0 flex items-center justify-center shrink-0 cursor-pointer"
                    onClick={() => setHowWindowOpen(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden className="text-base leading-none">×</span>
                  </Button>
                </WindowHeader>
                <WindowContent>
                  <p className="mb-3">View the source code for this site:</p>
                  <Anchor href={REPO_URL} target="_blank" rel="noopener noreferrer" underline>
                    {REPO_URL}
                  </Anchor>
                </WindowContent>
              </Window>
            </div>
          )}
        </main>
      </div>
      <ChickenCanvas />
    </div>
  );
}
