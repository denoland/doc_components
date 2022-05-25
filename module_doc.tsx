// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNode } from "./deps.ts";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { Usage } from "./usage.tsx";
import { type Child, maybe, take } from "./utils.ts";

export function ModuleDoc(
  { children, library = false, url }: {
    children: Child<DocNode[]>;
    library?: boolean;
    url: string;
  },
) {
  const docNodes = take(children, true);
  return (
    <article class={style("main")}>
      {maybe(
        !(library || url.endsWith(".d.ts")),
        <div>
          <h1 class={style("section")}>Usage</h1>
          <Usage url={url} />
        </div>,
      )}
    </article>
  );
}
