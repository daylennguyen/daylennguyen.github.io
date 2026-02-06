import type { Meta, StoryObj } from "@storybook/react";
import LoadingScreen from "../app/components/LoadingScreen";

const meta: Meta<typeof LoadingScreen> = {
  title: "Components/LoadingScreen",
  component: LoadingScreen,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-screen loading screen with progress bar. Runs for LOADING_DURATION_MS (1.2s by default) then calls onComplete.",
      },
    },
  },
  argTypes: {
    onComplete: {
      action: "onComplete",
      description:
        "Callback fired when the loading progress reaches 100%.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingScreen>;

/**
 * Default loading screen with the Windows 95-style progress bar.
 * Completes after ~1.2 seconds.
 */
export const Default: Story = {};
