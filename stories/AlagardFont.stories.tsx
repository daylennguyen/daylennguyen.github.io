import type { Meta, StoryObj } from "@storybook/react";
import localFont from "next/font/local";

const alagard = localFont({
  src: "../public/alagard.ttf",
  variable: "--font-alagard",
  display: "swap",
});

interface FontShowcaseProps {
  text: string;
  size: "small" | "medium" | "large" | "xlarge";
  darkMode: boolean;
}

const FontShowcase = ({ text, size, darkMode }: FontShowcaseProps) => {
  const sizeClasses = {
    small: "text-lg",
    medium: "text-3xl",
    large: "text-5xl",
    xlarge: "text-8xl",
  };

  return (
    <div
      className={`${alagard.variable} p-8 min-h-screen ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      style={{ fontFamily: "var(--font-alagard), sans-serif" }}
    >
      <p className={sizeClasses[size]}>{text}</p>
    </div>
  );
};

const meta: Meta<typeof FontShowcase> = {
  title: "Typography/Alagard Font",
  component: FontShowcase,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Alagard is a pixel art font perfect for retro game aesthetics. This showcase demonstrates the font at various sizes.",
      },
    },
  },
  args: {
    text: "The quick brown fox jumps over the lazy dog",
    size: "large",
    darkMode: true,
  },
  argTypes: {
    text: {
      control: "text",
      description: "The text to display",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large", "xlarge"],
      description: "Font size",
    },
    darkMode: {
      control: "boolean",
      description: "Toggle dark mode",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FontShowcase>;

/**
 * The classic pangram displayed in Alagard font - contains every letter of the alphabet.
 */
export const QuickBrownFox: Story = {
  args: {
    text: "The quick brown fox jumps over the lazy dog",
    size: "large",
    darkMode: true,
  },
};

/**
 * All uppercase letters in the Alagard font.
 */
export const Uppercase: Story = {
  args: {
    text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    size: "large",
    darkMode: true,
  },
};

/**
 * All lowercase letters in the Alagard font.
 */
export const Lowercase: Story = {
  args: {
    text: "abcdefghijklmnopqrstuvwxyz",
    size: "large",
    darkMode: true,
  },
};

/**
 * Numbers and common symbols.
 */
export const NumbersAndSymbols: Story = {
  args: {
    text: "0123456789 !@#$%^&*()_+-=[]{}|;':\",./<>?",
    size: "medium",
    darkMode: true,
  },
};

/**
 * Extra large display size for hero text.
 */
export const HeroSize: Story = {
  args: {
    text: "Daylen Nguyen",
    size: "xlarge",
    darkMode: true,
  },
};

/**
 * Light mode variant.
 */
export const LightMode: Story = {
  args: {
    text: "The quick brown fox jumps over the lazy dog",
    size: "large",
    darkMode: false,
  },
};


