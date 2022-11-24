// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNodeVariable } from "../deps.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";
import { Context } from "./markdown.tsx";
import { DocEntry, Examples, nameToId, Section } from "./doc_common.tsx";

export function DocBlockVariable(
  { children, context }: {
    children: Child<DocNodeVariable>;
    context: Context;
  },
) {
  const def = take(children);
  const id = nameToId("variable", def.name);

  if (!def.variableDef.tsType) {
    return null;
  }

  return (
    <div class={style("docBlockItems")}>
      <Examples context={context}>{def.jsDoc}</Examples>

      <Section title="type">
        {[
          <DocEntry id={id} location={def.location} context={context}>
            <TypeDef context={context}>
              {def.variableDef.tsType}
            </TypeDef>
          </DocEntry>,
        ]}
      </Section>
    </div>
  );
}
