// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

interface JsxRuntime {
  Fragment: (props: Record<string, unknown>) => unknown;
  h: (
    type: string,
    props: Record<string, unknown>,
    // deno-lint-ignore no-explicit-any
    ...children: any[]
  ) => unknown;
}

export const runtime: JsxRuntime = {
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
};

export function setRuntime(value: JsxRuntime): void {
  Object.assign(runtime, value);
}
