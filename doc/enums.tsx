// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeEnum } from "../deps.ts";
import { nameToId, Section, DocEntry } from "./doc_common.tsx";
import { MarkdownContext } from "./markdown.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";

function byName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

export function DocBlockEnum(
  { children, ...markdownContext }:
    & { children: Child<DocNodeEnum> }
    & MarkdownContext,
) {
  const { name: enumName, enumDef: { members }, location } = take(children);
  const items = [...members].sort(byName).map(({ name, init, jsDoc }) => {
    const id = nameToId("enum", `${enumName}_${name}`);
    return (
      <DocEntry
        id={id}
        location={location}
        name={name}
        jsDoc={jsDoc}
        {...markdownContext}
      >
        {init && (
          <>
            {" = "}
            <TypeDef {...markdownContext}>{init}</TypeDef>
          </>
        )}
      </DocEntry>
    );
  });
  return (
    <div class={style("docBlockItems")}>
      <Section title="Members">{items}</Section>
    </div>
  );
}
