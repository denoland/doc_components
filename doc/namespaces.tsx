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
  { children, namespace: parentNamespace, ...markdownContext }:
    & { children: Child<DocNodeNamespace> }
    & MarkdownContext,
) {
  const { name, namespaceDef: { elements } } = take(children);
  const namespace = parentNamespace ? `${parentNamespace}.${name}` : name;
  const collection = asCollection(elements);
  const context = { namespace, ...markdownContext };
  return (
    <div class={style("docBlockItems")}>
      <DocTypeSections {...context}>
        {collection}
      </DocTypeSections>
    </div>
  );
}
