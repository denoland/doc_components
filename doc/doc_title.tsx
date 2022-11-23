// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { DocSubTitleClass } from "./classes.tsx";
import { type DocNode } from "../deps.ts";
import { DocSubTitleInterface } from "./interfaces.tsx";
import { type Child, decamelize, take } from "./utils.ts";
import { docNodeKindColors } from "./symbol_kind.tsx";
import { Context } from "./markdown.tsx";

export function DocTitle(
  { children, name, context }: {
    children: Child<DocNode>;
    name: string;
    context: Context;
  },
) {
  const docNode = take(children, true);
  let subTitle;
  switch (docNode.kind) {
    case "class":
      context.typeParams = docNode.classDef.typeParams.map(({ name }) => name);
      subTitle = (
        <DocSubTitleClass context={context}>
          {docNode}
        </DocSubTitleClass>
      );
      break;
    case "interface":
      context.typeParams = docNode.interfaceDef.typeParams.map(({ name }) =>
        name
      );
      subTitle = (
        <DocSubTitleInterface context={context}>
          {docNode}
        </DocSubTitleInterface>
      );
      break;
  }

  return (
    <div class="font-medium space-y-1">
      <div class="text-xl">
        <span class={`text-[${docNodeKindColors[docNode.kind][0]}]`}>
          {decamelize(docNode.kind)}
        </span>{" "}
        <span class="font-bold">{name}</span>
      </div>
      {subTitle && (
        <div class="text-sm leading-4 space-y-0.5">
          {subTitle}
        </div>
      )}
    </div>
  );
}
