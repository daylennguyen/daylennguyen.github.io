import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DraggableWindow from "../app/components/DraggableWindow";

const meta: Meta<typeof DraggableWindow> = {
  title: "Components/DraggableWindow",
  component: DraggableWindow,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A draggable Windows 95-style window with title bar and close button. Supports both translate and right/top positioning modes.",
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

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <DraggableWindow
        title="Example Window"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={{ x: 0, y: 0 }}
      >
        <p>This is a draggable window.</p>
        <p>Try dragging it by the title bar!</p>
      </DraggableWindow>
    );
  },
};

export const RightTopPositioning: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <DraggableWindow
        title="Top-Right Window"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={{ x: 20, y: 20 }}
        positionMode="rightTop"
      >
        <p>Fixed to top-right corner.</p>
      </DraggableWindow>
    );
  },
};

export const CustomContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <DraggableWindow
        title="Custom Styled"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={{ x: 100, y: 50 }}
        contentClassName="!p-0"
      >
        <div
          style={{
            width: "200px",
            height: "150px",
            background: "#3b9fcc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          No padding
        </div>
      </DraggableWindow>
    );
  },
};
