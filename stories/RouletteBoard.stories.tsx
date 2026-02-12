import type { Meta, StoryObj } from "@storybook/react";
import Roulette from "../app/components/Roulette";

const meta: Meta<typeof Roulette> = {
  title: "Roulette/RouletteBoard",
  component: Roulette,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The roulette betting board: European layout with green 0, number grid 1–36 (red/black), 2:1 column bets aligned with 36/35/34, dozen bets (1 to 12, 13 to 24, 25 to 36), and outside bets (1 to 18, Even, Red, Black, Odd, 19 to 36). Bet eggs by clicking cells; Spin resolves bets and spins the wheel.",
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
          background: "#c0c0c0",
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
 * Full roulette UI including the betting board. Click number cells or outside bets to place eggs; click Spin when at least one bet is placed.
 */
export const Default: Story = {};

/**
 * Board with custom initial egg balance can be verified by checking the Eggs counter after placing bets and spinning.
 */
export const WithBets: Story = {
  parameters: {
    docs: {
      description: {
        story: "Place bets on numbers or Red/Black/etc., then Spin to resolve. Egg balance updates after each spin.",
      },
    },
  },
};
