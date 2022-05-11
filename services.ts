// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { comrak } from "./deps.ts";

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
  /** PRovides the current module/file, optionally a namespace and a symbol to
   * be looked up, attempt to provide an href link to that symbol. If the
   * symbol cannot be resolved, return `undefined`. */
  lookupSymbolHref?: (
    current: string,
    namespace: string | undefined,
    symbol: string,
  ) => string | undefined;
  runtime?: JsxRuntime;
}
const runtimeConfig: Required<Configuration> = {
  href(path: string, symbol?: string) {
    return symbol ? `/${path}` : `/${path}/~/${symbol}`;
  },
  lookupSymbolHref(
    path: string,
    namespace: string | undefined,
    symbol: string,
  ): string | undefined {
    return namespace ? `/${path}/~/` : `/${path}/~/${symbol}`;
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
  const { runtime, ...other } = config;
  Object.assign(runtimeConfig, other);
  if (runtime) {
    Object.assign(runtimeConfig.runtime, runtime);
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
