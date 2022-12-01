// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNodeNamespace } from "../deps.ts";
import { type Context } from "./markdown.tsx";
import { DocTypeSections } from "./module_doc.tsx";
import { style } from "../styles.ts";
import { asCollection, Child, take } from "./utils.ts";
import { Examples } from "./doc_common.tsx";

export function DocBlockNamespace(
  { children, context }: {
    children: Child<DocNodeNamespace>;
    context: Context;
  },
) {
  const def = take(children);
  const collection = asCollection(def.namespaceDef.elements);
  return (
    <div class={style("docBlockItems")}>
      <Examples context={context}>{def.jsDoc}</Examples>

      <DocTypeSections context={context}>
        {collection}
      </DocTypeSections>
    </div>
  );
}
