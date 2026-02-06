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
          "Animated fish canvas with swimming animation, bobbing motion, and click-to-spin. Click the fish to add 6 rotations; clicking again extends the spin.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#f0f0f0", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FishCanvas>;

export const Default: Story = {};
