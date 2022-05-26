// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import {
  comrak,
  type Configuration as TwConfiguration,
  setup as twSetup,
  type ThemeConfiguration,
  twColors,
} from "./deps.ts";

interface JsxRuntime {
  Fragment: (props: Record<string, unknown>) => unknown;
  h: (
    type: string,
    props: Record<string, unknown>,
    // deno-lint-ignore no-explicit-any
    ...children: any[]
  ) => unknown;
}

export interface Configuration {
  /** Provided the current path and optionally a symbol from that path, return
   * an href link. */
  href?: (path: string, symbol?: string) => string;
  /** Provides the current module/file, optionally a namespace and a symbol to
   * be looked up, attempt to provide an href link to that symbol. If the
   * symbol cannot be resolved, return `undefined`. */
  lookupSymbolHref?: (
    current: string,
    namespace: string | undefined,
    symbol: string,
  ) => string | undefined;
  runtime?: JsxRuntime;
  /** If provided, the twind {@linkcode twSetup setup} will be performed. */
  tw?: TwConfiguration;
}

export const theme: ThemeConfiguration = {
  backgroundSize: {
    "4": "1rem",
  },
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
};

const runtimeConfig: Required<
  Pick<Configuration, "href" | "lookupSymbolHref" | "runtime">
> = {
  href(current: string, symbol?: string) {
    return symbol ? `/${current}` : `/${current}/~/${symbol}`;
  },
  lookupSymbolHref(
    current: string,
    namespace: string | undefined,
    symbol: string,
  ): string | undefined {
    return namespace
      ? `/${current}/~/${namespace}.${symbol}`
      : `/${current}/~/${symbol}`;
  },
  runtime: {
    Fragment() {
      throw new TypeError(
        "The JSX runtime.Fragment is unset and must be set via setRuntime().",
      );
    },
    h() {
      throw new TypeError(
        "The JSX runtime.h is unset and must be set via setRuntime().",
      );
    },
  },
};

/** Setup the services used by the doc components. */
export async function setup(config: Configuration) {
  const { runtime, tw, ...other } = config;
  Object.assign(runtimeConfig, other);
  if (runtime) {
    Object.assign(runtimeConfig.runtime, runtime);
  }
  if (tw) {
    twSetup(tw);
  }
  await comrak.init();
}

export const runtime: JsxRuntime = {
  get Fragment() {
    return runtimeConfig.runtime.Fragment;
  },
  get h() {
    return runtimeConfig.runtime.h;
  },
};

export const services = {
  /** Return a link to the provided path and optional symbol. */
  get href(): (path: string, symbol?: string) => string {
    return runtimeConfig.href;
  },

  get lookupSymbolHref(): (
    current: string,
    namespace: string | undefined,
    symbol: string,
  ) => string | undefined {
    return runtimeConfig.lookupSymbolHref;
  },
};
