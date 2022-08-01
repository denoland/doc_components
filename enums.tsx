// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeEnum } from "./deps.ts";
import { Anchor, DocEntry, nameToId, SectionTitle } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { MarkdownContext } from "./markdown.tsx";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, maybe, take } from "./utils.ts";

function byName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

export function CodeBlockEnum(
  { children, ...props }: {
    children: Child<DocNodeEnum>;
    url: string;
    namespace?: string;
  },
) {
  const { name, enumDef: { members } } = take(children);
  const items = [...members].sort(byName).map(({ name, init }) => (
    <>
      {name}
      {init && (
        <>
          {" "}= <TypeDef code inline {...props}>{init}</TypeDef>
        </>
      )},
    </>
  ));
  return (
    <div class={style("codeBlock")}>
      <span class={style("codeKeyword")}>enum</span> {name} &#123;{" "}
      {maybe(items.length, <div class={style("indent")}>{items}</div>)} &#125;
    </div>
  );
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
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocEntry location={location}>
          {`${enumName}.${name}`}
          {init && (
            <>
              {" "} = <TypeDef inline {...markdownContext}>{init}</TypeDef>
            </>
          )}
        </DocEntry>
        <JsDoc {...markdownContext}>{jsDoc}</JsDoc>
      </div>
    );
  });
  return (
    <div class={style("docBlockItems")}>
      <SectionTitle>Members</SectionTitle>
      {items}
    </div>
  );
}
