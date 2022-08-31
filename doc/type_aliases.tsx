// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNodeTypeAlias } from "../deps.ts";
import { Anchor, DocEntry, nameToId, Tag } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { DocTypeParams, TypeDef } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

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
        <DocEntry location={location} name={""}>
          <span class={style("keyword")}>type</span> {name}
          <DocTypeParams {...markdownContext}>{typeParams}</DocTypeParams> =
          {" "}
          <TypeDef {...markdownContext}>{tsType}</TypeDef>
          {tags}
        </DocEntry>
      </div>
      <DocTypeParams {...markdownContext}>
        {typeParams}
      </DocTypeParams>
      <JsDoc {...markdownContext}>
        {jsDoc}
      </JsDoc>
    </div>
  );
}
