"use client";

import { useEffect, useState } from "react";
import ChickenCanvas from "./components/ChickenCanvas";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  AppBar,
  Toolbar,
} from "react95";

const GITHUB_URL = "https://github.com/daylennguyen";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Home() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <AppBar position="relative" className="z-20 shrink-0">
        <Toolbar className="w-full justify-between">
          <div className="flex items-center gap-1">
            <Button variant="menu" size="sm">
              📺 Start
            </Button>
          </div>
          <div className="flex items-center px-2 text-sm font-bold tabular-nums">
            {time}
          </div>
        </Toolbar>
      </AppBar>
      <div className="flex flex-1 items-center justify-center p-4 pt-2">
      <main className="relative z-10 w-fit max-w-[min(100%,42rem)]">
        <Window shadow>
          <WindowHeader
            active
            className="flex justify-center"
          >
            <span>Daylen Nguyen</span>
          </WindowHeader>
          <WindowContent className="">
            <div className="flex flex-col gap-6 py-2 items-center text-center">
              <p className="text-lg leading-relaxed">
                Welcome to my small slice of the internet 🧙🏻‍♂️
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  primary
                  onClick={() => window.open(GITHUB_URL, "_blank", "noopener,noreferrer")}
                >
                  GitHub
                </Button>
              </div>
            </div>
          </WindowContent>
        </Window>
      </main>
      </div>
      <ChickenCanvas />
    </div>
  );
}
