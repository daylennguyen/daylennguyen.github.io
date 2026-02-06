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

export const Default: Story = {
  args: {
    buttons: [
      {
        label: "Daylen",
        icon: "🧙",
        active: true,
        onClick: () => console.log("Daylen clicked"),
      },
      {
        label: "About",
        active: false,
        onClick: () => console.log("About clicked"),
      },
    ],
    onFishyClick: () => console.log("Fishy clicked from Start menu"),
  },
};

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
    onFishyClick: () => {},
  },
};
