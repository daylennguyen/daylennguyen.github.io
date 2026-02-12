import type { Meta, StoryObj } from "@storybook/react";
import Roulette from "../app/components/Roulette";

const meta: Meta<typeof Roulette> = {
  title: "Components/Roulette",
  component: Roulette,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Roulette wheel with 12 segments. Click Roll to spin the wheel; it eases out and lands on a random segment. Last result is shown below the button.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
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
type Story = StoryObj<typeof Roulette>;

/**
 * Default roulette. Click "Roll" to spin the wheel; it will decelerate and stop on a random segment.
 */
export const Default: Story = {};
