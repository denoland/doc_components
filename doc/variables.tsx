// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeVariable } from "../deps.ts";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";
import { MarkdownContext } from "./markdown.tsx";
import { DocEntry, nameToId, Section } from "./doc_common.tsx";

export function DocBlockVariable(
  { children, markdownContext }: {
    children: Child<DocNodeVariable>;
    markdownContext: MarkdownContext;
  },
) {
  const def = take(children);
  const id = nameToId("variable", def.name);

  if (!def.variableDef.tsType) {
    return null;
  }

  return (
    <div class={style("docBlockItems")}>
      <Section>
        {[
          <DocEntry
            id={id}
            location={def.location}
            markdownContext={markdownContext}
          >
            <TypeDef markdownContext={markdownContext}>
              {def.variableDef.tsType}
            </TypeDef>
          </DocEntry>,
        ]}
      </Section>
    </div>
  );
}
