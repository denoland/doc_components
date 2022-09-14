// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeNamespace } from "../deps.ts";
import { type MarkdownContext } from "./markdown.tsx";
import { DocTypeSections } from "./module_doc.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { asCollection, Child, take } from "./utils.ts";

export function DocBlockNamespace(
  { children, markdownContext }: {
    children: Child<DocNodeNamespace>;
    markdownContext: MarkdownContext;
  },
) {
  const def = take(children);
  const collection = asCollection(def.namespaceDef.elements);
  return (
    <div class={style("docBlockItems")}>
      <DocTypeSections markdownContext={markdownContext}>
        {collection}
      </DocTypeSections>
    </div>
  );
}
