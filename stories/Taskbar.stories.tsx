import type { Meta, StoryObj } from "@storybook/react";
import Taskbar from "../app/components/Taskbar";

const meta: Meta<typeof Taskbar> = {
  title: "Components/Taskbar",
  component: Taskbar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Windows 95-style taskbar with Start menu, app buttons, and clock. Displays current time and allows toggling windows.",
      },
    },
  },
  args: {
    buttons: [
      {
        label: "Daylen",
        icon: "🧙",
        active: true,
        onClick: () => {},
      },
      {
        label: "About",
        active: false,
        onClick: () => {},
      },
    ],
  },
  argTypes: {
    buttons: {
      description:
        "Array of taskbar button objects with label, icon, active state, and onClick handler.",
    },
    onFishyClick: {
      action: "onFishyClick",
      description: "Called when the Fishy item is clicked in the Start menu.",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", background: "rgb(0, 128, 129)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Taskbar>;

/**
 * Default taskbar with two buttons (Daylen and About) and a working Start menu.
 */
export const Default: Story = {};

/**
 * Taskbar with multiple active and inactive window buttons.
 */
export const WithMultipleButtons: Story = {
  args: {
    buttons: [
      {
        label: "Window 1",
        active: true,
        onClick: () => {},
      },
      {
        label: "Window 2",
        active: false,
        onClick: () => {},
      },
      {
        label: "Window 3",
        active: true,
        onClick: () => {},
      },
    ],
  },
};
