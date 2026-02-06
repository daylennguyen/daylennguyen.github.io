import type { Meta, StoryObj } from "@storybook/react";
import FishCanvas from "../app/components/FishCanvas";

const meta: Meta<typeof FishCanvas> = {
  title: "Components/FishCanvas",
  component: FishCanvas,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Animated fish canvas with swimming animation, bobbing motion, and click-to-spin. Click the fish to add rotations; clicking again extends the spin.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "#3b9fcc",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FishCanvas>;

/**
 * Default fish canvas. The fish swims in place with a bobbing animation.
 * Move your mouse to change the fish's facing direction, and click to spin it.
 */
export const Default: Story = {};
