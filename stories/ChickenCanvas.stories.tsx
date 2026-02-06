import type { Meta, StoryObj } from "@storybook/react";
import ChickenCanvas from "../app/components/ChickenCanvas";

const meta: Meta<typeof ChickenCanvas> = {
  title: "Components/ChickenCanvas",
  component: ChickenCanvas,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A Minecraft-style chicken that follows the cursor, walking on grass and dirt blocks. Uses canvas for pixel-perfect rendering. Left-click to hit, right-click to toggle resting.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: "100vh",
          position: "relative",
          background: "#1a1a1a",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChickenCanvas>;

/**
 * The default ChickenCanvas shows a Minecraft chicken walking on grass/dirt blocks.
 * Move your mouse to make the chicken follow the cursor. Left-click to hit it,
 * right-click to toggle resting mode.
 */
export const Default: Story = {};

/**
 * View in a light background context to see how the canvas appears on light pages.
 */
export const LightBackground: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          height: "100vh",
          position: "relative",
          background: "#ffffff",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
