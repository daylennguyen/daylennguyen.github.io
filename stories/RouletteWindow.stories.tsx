import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DraggableWindow from "../app/components/DraggableWindow";
import Roulette from "../app/components/Roulette";

const meta: Meta<typeof DraggableWindow> = {
  title: "Roulette/RouletteWindow",
  component: DraggableWindow,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The roulette game inside a draggable Windows 95-style window. Includes the wheel, betting board, egg balance, and Spin button. Drag the title bar to move the window.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: "100vh",
          background: "rgb(0, 128, 129)",
          position: "relative",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DraggableWindow>;

/**
 * Full roulette window as shown in the app. Place bets with eggs, then spin the wheel.
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <DraggableWindow
        title="Roulette"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={{ x: 120, y: 80 }}
        positionMode="rightTop"
      >
        <Roulette />
      </DraggableWindow>
    );
  },
};

/**
 * Roulette window in centered (translate) positioning mode.
 */
export const Centered: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <DraggableWindow
        title="Roulette"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={{ x: 0, y: 0 }}
        positionMode="translate"
      >
        <Roulette />
      </DraggableWindow>
    );
  },
};
