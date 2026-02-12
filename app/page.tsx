"use client";

import { useState } from "react";
import { Button, Anchor } from "react95";
import ChickenCanvas from "./components/ChickenCanvas";
import FishCanvas from "./components/FishCanvas";
import Roulette from "./components/Roulette";
import LoadingScreen from "./components/LoadingScreen";
import DraggableWindow from "./components/DraggableWindow";
import Taskbar from "./components/Taskbar";
import { GITHUB_URL, REPO_URL, STORYBOOK_URL } from "./lib/constants";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [windowOpen, setWindowOpen] = useState(true);
  const [howWindowOpen, setHowWindowOpen] = useState(false);
  const [fishWindowOpen, setFishWindowOpen] = useState(true);
  const [rouletteWindowOpen, setRouletteWindowOpen] = useState(false);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="flex h-screen flex-col">
      <Taskbar
        buttons={[
          {
            label: "Daylen",
            icon: "🧙",
            active: windowOpen,
            onClick: () => setWindowOpen(true),
          },
          {
            label: "About",
            active: howWindowOpen,
            onClick: () => setHowWindowOpen(true),
          },
        ]}
        onFishyClick={() => setFishWindowOpen(true)}
        onRouletteClick={() => setRouletteWindowOpen(true)}
        onStorybookClick={() =>
          window.open(STORYBOOK_URL, "_blank", "noopener,noreferrer")
        }
      />
      <div className="flex flex-1 items-center justify-center p-4 pt-2">
        <main className="relative z-10 w-fit max-w-[min(100%,42rem)]">
          {windowOpen && (
            <DraggableWindow
              title="Daylen Nguyen"
              isOpen={windowOpen}
              onClose={() => setWindowOpen(false)}
              initialPosition={{ x: 0, y: 0 }}
              positionMode="translate"
            >
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
            </DraggableWindow>
          )}

          <DraggableWindow
            title="How this page is made"
            isOpen={howWindowOpen}
            onClose={() => setHowWindowOpen(false)}
            initialPosition={{ x: 80, y: 60 }}
            positionMode="translate"
          >
            <p className="mb-3">View the source code for this site:</p>
            <Anchor
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              underline
            >
              {REPO_URL}
            </Anchor>
          </DraggableWindow>

          <DraggableWindow
            title="🐟 Fishy"
            isOpen={fishWindowOpen}
            onClose={() => setFishWindowOpen(false)}
            initialPosition={{ x: 12, y: 50 }}
            positionMode="rightTop"
            contentClassName="!p-0"
          >
            <FishCanvas />
          </DraggableWindow>

          <DraggableWindow
            title="Roulette"
            isOpen={rouletteWindowOpen}
            onClose={() => setRouletteWindowOpen(false)}
            initialPosition={{ x: 120, y: 80 }}
            positionMode="rightTop"
          >
            <Roulette />
          </DraggableWindow>
        </main>
      </div>
      <ChickenCanvas />
    </div>
  );
}
