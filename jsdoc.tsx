// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { tw } from "./deps.ts";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";

export function Tag(
  { children, color = "gray" }: { children: unknown; color: string },
) {
  return (
    <span>
      {" "}
      <span
        class={tw`bg-${color}(100 dark:800) text-${color}(800 dark:100) ${
          style("tag", true)
        }`}
      >
        {children}
      </span>
    </span>
  );
}
