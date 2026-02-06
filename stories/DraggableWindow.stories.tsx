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
  args: {
    title: "Example Window",
    isOpen: true,
    initialPosition: { x: 0, y: 0 },
    positionMode: "translate",
    contentClassName: "",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed in the window header",
    },
    isOpen: {
      control: "boolean",
      description: "Whether the window is visible",
    },
    onClose: {
      action: "closed",
      description: "Called when the close button is clicked",
    },
    positionMode: {
      control: "select",
      options: ["translate", "rightTop"],
      description:
        '"translate" for centered windows, "rightTop" for fixed right/top positioning',
    },
    contentClassName: {
      control: "text",
      description: "Optional className applied to the WindowContent",
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
 * Default draggable window centered on screen.
 * Drag it by the title bar and close it with the X button.
 */
export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <DraggableWindow
        title={args.title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={args.initialPosition}
        positionMode={args.positionMode}
        contentClassName={args.contentClassName}
      >
        <p>This is a draggable window.</p>
        <p>Try dragging it by the title bar!</p>
      </DraggableWindow>
    );
  },
};

/**
 * Window positioned using right/top mode — anchored to the top-right corner.
 */
export const RightTopPositioning: Story = {
  args: {
    title: "Top-Right Window",
    initialPosition: { x: 20, y: 20 },
    positionMode: "rightTop",
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <DraggableWindow
        title={args.title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={args.initialPosition}
        positionMode={args.positionMode}
      >
        <p>Fixed to top-right corner.</p>
      </DraggableWindow>
    );
  },
};

/**
 * Window with custom content and no padding via contentClassName.
 */
export const CustomContent: Story = {
  args: {
    title: "Custom Styled",
    initialPosition: { x: 100, y: 50 },
    contentClassName: "!p-0",
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <DraggableWindow
        title={args.title}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={args.initialPosition}
        contentClassName={args.contentClassName}
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
