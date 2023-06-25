import { apply, type Plugin, type ThemeConfiguration } from "twind";
import * as twColors from "twind/colors";
import { css } from "twind/css";

export const theme: ThemeConfiguration = {
  colors: {
    transparent: "transparent",
    current: "currentColor",
    ...twColors,
  },
  fontFamily: {
    mono: [
      "Menlo",
      "Monaco",
      '"Lucida Console"',
      "Consolas",
      '"Liberation Mono"',
      '"Courier New"',
      "monospace",
    ],
  },
  extend: {
    spacing: {
      4.5: "1.125rem",
      18: "4.5rem",
      72: "18rem",
    },
    backgroundSize: {
      "4": "1rem",
    },
  },
};

export const plugins: Record<string, Plugin> = {
  link:
    apply`text-blue-600 transition duration-75 ease-in-out hover:text-blue-400`,
  "section-x-inset": (parts) =>
    parts[0] === "none"
      ? apply`max-w-none mx-0 px-0`
      : apply`max-w-screen-${parts[0]} mx-auto px-6 md:px-8 lg:px-10 xl:px-14`,
  "divide-incl-y": (parts) =>
    css({
      "& > *": {
        "&:first-child": {
          "border-top-width": (parts[0] ?? 1) + "px",
        },
        "border-top-width": "0px",
        "border-bottom-width": (parts[0] ?? 1) + "px",
      },
    }),
  "icon-button": apply`border border-gray-300 rounded p-2 hover:bg-gray-100`,
};
