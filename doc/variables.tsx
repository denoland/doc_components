// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeVariable } from "../deps.ts";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";
import { Context } from "./markdown.tsx";
import { DocEntry, nameToId, Section } from "./doc_common.tsx";

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
