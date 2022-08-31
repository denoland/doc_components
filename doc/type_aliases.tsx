// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNodeTypeAlias } from "../deps.ts";
import { Anchor, DocEntry, nameToId, tagVariants } from "./doc_common.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

export function DocBlockTypeAlias(
  { children, ...markdownContext }:
    & { children: Child<DocNodeTypeAlias> }
    & MarkdownContext,
) {
  const { name, location, jsDoc, typeAliasDef } = take(children);
  const id = nameToId("typeAlias", name);
  const tags = [];
  if (isDeprecated({ jsDoc })) {
    tags.push(tagVariants.deprecated());
  }
  return (
    <div class={style("docBlockItems")}>
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocEntry location={location} tags={tags} name={name}>
          : <TypeDef {...markdownContext}>{typeAliasDef.tsType}</TypeDef>
        </DocEntry>
      </div>
    </div>
  );
}
