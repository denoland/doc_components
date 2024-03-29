// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

import { type DocNodeEnum } from "../deps.ts";
import { DocEntry, Examples, nameToId, Section } from "./doc_common.tsx";
import { Context } from "./markdown.tsx";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";

function byName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

export function DocBlockEnum(
  { children, context }: {
    children: Child<DocNodeEnum>;
    context: Context;
  },
) {
  const { name: enumName, enumDef: { members }, location, jsDoc } = take(
    children,
  );
  const items = [...members].sort(byName).map(({ name, init, jsDoc }) => {
    const id = nameToId("enum", `${enumName}_${name}`);
    return (
      <DocEntry
        id={id}
        location={location}
        name={name}
        jsDoc={jsDoc}
        context={context}
      >
        {init && (
          <>
            {" = "}
            <TypeDef context={context}>
              {init}
            </TypeDef>
          </>
        )}
      </DocEntry>
    );
  });
  return (
    <div class={style("docBlockItems")}>
      <Examples context={context}>{jsDoc}</Examples>
      <Section title="Members">{items}</Section>
    </div>
  );
}
