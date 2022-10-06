// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { DocBlockClass } from "./classes.tsx";
import { type DocNode, type DocNodeFunction } from "../deps.ts";
import { DocBlockEnum } from "./enums.tsx";
import { DocBlockFunction } from "./functions.tsx";
import { DocBlockInterface } from "./interfaces.tsx";
import { type Context } from "./markdown.tsx";
import { DocBlockNamespace } from "./namespaces.tsx";
import { runtime } from "../services.ts";
import { DocBlockTypeAlias } from "./type_aliases.tsx";
import { type Child, take } from "./utils.ts";
import { DocBlockVariable } from "./variables.tsx";

export function DocBlock(
  { children, name, context }: {
    children: Child<DocNode[]>;
    name: string;
    context: Context;
  },
) {
  const docNodes = take(children, true);
  const elements = [];
  for (const docNode of docNodes) {
    switch (docNode.kind) {
      case "class":
        elements.push(
          <DocBlockClass context={context}>
            {docNode}
          </DocBlockClass>,
        );
        break;
      case "enum":
        elements.push(
          <DocBlockEnum context={context}>
            {docNode}
          </DocBlockEnum>,
        );
        break;
      case "interface":
        elements.push(
          <DocBlockInterface context={context}>
            {docNode}
          </DocBlockInterface>,
        );
        break;
      case "namespace":
        elements.push(
          <DocBlockNamespace context={{ ...context, namespace: name }}>
            {docNode}
          </DocBlockNamespace>,
        );
        break;
      case "typeAlias":
        elements.push(
          <DocBlockTypeAlias context={context}>
            {docNode}
          </DocBlockTypeAlias>,
        );
        break;
      case "variable":
        elements.push(
          <DocBlockVariable context={context}>
            {docNode}
          </DocBlockVariable>,
        );
        break;
    }
  }
  const fnNodes = docNodes.filter(({ kind }) =>
    kind === "function"
  ) as DocNodeFunction[];
  if (fnNodes.length) {
    elements.push(
      <DocBlockFunction context={context}>
        {fnNodes}
      </DocBlockFunction>,
    );
  }
  return <div>{elements}</div>;
}
