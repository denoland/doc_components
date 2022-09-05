// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNodeTypeAlias } from "../deps.ts";
import { DocEntry, nameToId, tagVariants } from "./doc_common.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef, TypeParamsDoc } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

export function DocBlockTypeAlias(
  { children, markdownContext }: {
    children: Child<DocNodeTypeAlias>;
    markdownContext: MarkdownContext;
  },
) {
  const def = take(children);
  const id = nameToId("typeAlias", def.name);
  const tags = [];
  if (isDeprecated(def)) {
    tags.push(tagVariants.deprecated());
  }
  return (
    <div class={style("docBlockItems")}>
      <TypeParamsDoc base={def} markdownContext={markdownContext}>
        {def.typeAliasDef.typeParams}
      </TypeParamsDoc>

      <DocEntry
        id={id}
        location={def.location}
        tags={tags}
        name={def.name}
        jsDoc={def.jsDoc}
        markdownContext={markdownContext}
      >
        :{" "}
        <TypeDef markdownContext={markdownContext}>
          {def.typeAliasDef.tsType}
        </TypeDef>
      </DocEntry>
    </div>
  );
}
