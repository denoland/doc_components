// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNodeTypeAlias } from "./deps.ts";
import { Anchor, DocEntry, nameToId, Tag } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { TypeDef, TypeParams, TypeParamsDoc } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

export function CodeBlockTypeAlias({ children, ...props }: {
  children: Child<DocNodeTypeAlias>;
  url: string;
  namespace?: string;
}) {
  const { name, typeAliasDef: { typeParams, tsType } } = take(children);
  return (
    <div class={style("codeBlock")}>
      <span class={style("codeKeyword")}>type</span> {name}
      <TypeParams code {...props}>{typeParams}</TypeParams> ={" "}
      <TypeDef code terminate {...props}>{tsType}</TypeDef>
    </div>
  );
}

export function DocBlockTypeAlias(
  { children, ...markdownContext }:
    & { children: Child<DocNodeTypeAlias> }
    & MarkdownContext,
) {
  const { name, location, jsDoc, typeAliasDef: { typeParams, tsType } } = take(
    children,
  );
  const id = nameToId("typeAlias", name);
  const tags = [];
  if (isDeprecated({ jsDoc })) {
    tags.push(<Tag color="gray">deprecated</Tag>);
  }
  return (
    <div class={style("docBlockItems")}>
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocEntry location={location}>
          <span class={style("keyword")}>type</span> {name}{" "}
          <TypeParams {...markdownContext}>{typeParams}</TypeParams> ={" "}
          <TypeDef inline {...markdownContext}>{tsType}</TypeDef>
          {tags}
        </DocEntry>
      </div>
      <TypeParamsDoc location={location} {...markdownContext}>
        {typeParams}
      </TypeParamsDoc>
      <JsDoc
        tagKinds={["template", "deprecated"]}
        tagsWithDoc
        {...markdownContext}
      >
        {jsDoc}
      </JsDoc>
    </div>
  );
}
