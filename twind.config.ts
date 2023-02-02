import { apply, type Plugin, type ThemeConfiguration } from "twind";
import * as twColors from "twind/colors";
import { css } from "twind/css";

export const theme: ThemeConfiguration = {
  colors: {
    transparent: "transparent",
    current: "currentColor",
    black: twColors.black,
    white: twColors.white,
    gray: twColors.coolGray,
    red: twColors.red,
    yellow: twColors.amber,
    green: twColors.emerald,
    cyan: twColors.cyan,
    blue: twColors.lightBlue,
    indigo: twColors.indigo,
    purple: twColors.fuchsia,
    pink: twColors.pink,
  },
  fontFamily: {
    "sans": [
      "Inter var",
      "system-ui",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif",
    ],
    "mono": [
      "Menlo",
      "Monaco",
      "Lucida Console",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ],
  },
  extend: {
    colors: {
      primary: "#056CF0",
      symbol: "#7B61FF",
      border: "#DDDDDD",
      grayDefault: "#F3F3F3",
      ultralight: "#F8F7F6",
      danger: "#F00C08",

      mainBlue: "#0094FF",
      azure2: "#D2DDE2",
      azure3: "#E1ECF2",
    },
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
    apply`text-primary transition duration-75 ease-in-out hover:text-blue-400`,
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
  "icon-button": apply`border border-border rounded p-2 hover:bg-ultralight`,
};
