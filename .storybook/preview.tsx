import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import React95Provider from "../app/components/React95Provider";
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  decorators: [
    (Story) => (
      <React95Provider>
        <Story />
      </React95Provider>
    ),
  ],
};

export default preview;
