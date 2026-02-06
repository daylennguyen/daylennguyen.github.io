"use client";

import { useEffect, useState } from "react";
import { Window, WindowHeader, WindowContent, ProgressBar } from "react95";
import { LOADING_DURATION_MS } from "../lib/constants";

export type LoadingScreenProps = {
  onComplete?: () => void;
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps = {}) {
  const [loadProgress, setLoadProgress] = useState(0);

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
        onComplete?.();
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

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
