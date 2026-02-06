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
          "Full-screen loading screen with progress bar. Runs for LOADING_DURATION_MS (1.2s by default).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingScreen>;

export const Default: Story = {
  args: {
    onComplete: () => console.log("Loading complete!"),
  },
};
