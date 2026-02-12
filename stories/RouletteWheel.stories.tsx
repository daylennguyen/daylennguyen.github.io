import type { Meta, StoryObj } from "@storybook/react";
import Roulette from "../app/components/Roulette";

const meta: Meta<typeof Roulette> = {
  title: "Roulette/RouletteWheel",
  component: Roulette,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The roulette wheel: a European-style wheel (single green 0, red and black 1–36) with a white/silver ball that orbits during a spin and lands in a pocket. The yellow center spindle and segment labels match a real layout. Use the Spin button (after placing bets) to see the wheel and ball animate with an ease-out.",
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
          background: "rgb(0, 128, 129)",
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
 * Roulette wheel with betting board. The circular canvas at the top is the wheel;
 * place bets below and click Spin to watch the ball spin and land.
 */
export const Default: Story = {};
