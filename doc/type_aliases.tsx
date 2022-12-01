// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNodeTypeAlias } from "../deps.ts";
import { DocEntry, Examples, nameToId, tagVariants } from "./doc_common.tsx";
import { type Context } from "./markdown.tsx";
import { style } from "../styles.ts";
import { TypeDef, TypeParamsDoc } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

export function DocBlockTypeAlias(
  { children, context }: {
    children: Child<DocNodeTypeAlias>;
    context: Context;
  },
) {
  const def = take(children);
  const id = nameToId("typeAlias", def.name);
  context.typeParams = def.typeAliasDef.typeParams.map(({ name }) => name);
  const tags = [];
  if (isDeprecated(def)) {
    tags.push(tagVariants.deprecated());
  }
  return (
    <div class={style("docBlockItems")}>
      <Examples context={context}>{def.jsDoc}</Examples>

      <TypeParamsDoc base={def} context={context}>
        {def.typeAliasDef.typeParams}
      </TypeParamsDoc>

      <DocEntry
        id={id}
        location={def.location}
        tags={tags}
        name={"definition"}
        context={context}
      >
        :{" "}
        <TypeDef context={context}>
          {def.typeAliasDef.tsType}
        </TypeDef>
      </DocEntry>
    </div>
  );
}
