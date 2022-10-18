// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import {
  apply,
  comrak,
  type Configuration as TwConfiguration,
  css,
  type Plugin,
  setup as twSetup,
  type ThemeConfiguration,
  twColors,
} from "./deps.ts";
import { mdToHtml } from "./doc/markdown.tsx";
import { comrakStyles } from "./styles.ts";

export interface Configuration {
  /** Called when the doc components are trying to resolve a symbol.  The
   * current url is provided as a string, an optional namespace and the symbol
   * name attempting to be resolved.
   *
   * If provided the namespace, any nested namespaces will be separated by a
   * `.`.
   *
   * Implementors should search the scope of the current module and namespace
   * ascending to global scopes to resolve the href. If the symbol cannot be
   * found, the function should return `undefined`. */
  lookupHref?: (
    url: URL,
    namespace: string | undefined,
    symbol: string,
  ) => string | undefined;
  /** Called when the doc components are trying to generate a link to a path,
   * module or symbol within a module.  The URL to the path or module will be
   * provided, and the symbol will be provided.  If the symbol contains `.`,
   * the symbol is located within a namespace in the file.
   *
   * Implementors should return a string which will be used as the `href` value
   * for a link. */
  resolveHref?: (url: URL, symbol?: string) => string;
  /** Called when doc components are trying to generate a link to a source file.
   *
   * Implementors should return a string which which will be used as the `href`
   * value for a link to the source code view of a file. If no source file can
   * be resolved, `undefined` should be returned. */
  resolveSourceHref?: (url: string, line?: number) => string;
  /** Called when markdown needs to be rendered. */
  markdownToHTML?: (markdown: string) => string;
  /** If provided, the twind {@linkcode twSetup setup} will be performed. */
  tw?: TwConfiguration;
  /** Class to give to markdown blocks */
  markdownStyle?: string;
  /** Class to give to markdown summary blocks */
  markdownSummaryStyle?: string;
}

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
      secondary: "#E5E7EB",
      "default-highlight": "#333333C0",
      ultralight: "#F8F7F6",
      border: "#DDDDDD",
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
    apply`text-[#056CF0] transition duration-75 ease-in-out hover:text-blue-400`,
  "section-x-inset": (parts) =>
    parts[0] === "none"
      ? apply`max-w-none mx-0 px-0`
      : apply`max-w-screen-${parts[0]} mx-auto px-4 sm:px-6 md:px-8`,
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

const runtimeConfig: Required<
  Pick<
    Configuration,
    | "resolveHref"
    | "lookupHref"
    | "resolveSourceHref"
    | "markdownToHTML"
    | "markdownStyle"
    | "markdownSummaryStyle"
  >
> = {
  resolveHref(current, symbol) {
    return symbol ? `/${current}` : `/${current}/~/${symbol}`;
  },
  lookupHref(current, namespace, symbol) {
    return namespace
      ? `/${current}/~/${namespace}.${symbol}`
      : `/${current}/~/${symbol}`;
  },
  resolveSourceHref(url, line) {
    return line ? `${url}#L${line}` : url;
  },
  markdownToHTML: mdToHtml,
  markdownStyle: comrakStyles,
  markdownSummaryStyle: "",
};

/** Setup the services used by the doc components. */
export async function setup(config: Configuration) {
  const { tw, ...other } = config;
  Object.assign(runtimeConfig, other);
  if (tw) {
    twSetup(tw);
  }
  if (!other.markdownToHTML) {
    await comrak.init();
  }
}

export const services = {
  /** Return a link to the provided URL and optional symbol. */
  get resolveHref(): (url: URL, symbol?: string) => string {
    return runtimeConfig.resolveHref;
  },

  /** Attempt to find a link to a specific symbol from the current URL and
   * optionally namespace. */
  get lookupHref(): (
    url: URL,
    namespace: string | undefined,
    symbol: string,
  ) => string | undefined {
    return runtimeConfig.lookupHref;
  },

  get resolveSourceHref(): (url: string, line?: number) => string | undefined {
    return runtimeConfig.resolveSourceHref;
  },

  /** Render Markdown to HTML */
  get markdownToHTML(): (markdown: string) => string {
    return runtimeConfig.markdownToHTML;
  },

  /** Class to give to markdown blocks */
  get markdownStyle(): string {
    return runtimeConfig.markdownStyle;
  },
  /** Class to give to markdown summary blocks */
  get markdownSummaryStyle(): string {
    return runtimeConfig.markdownSummaryStyle;
  },
};
