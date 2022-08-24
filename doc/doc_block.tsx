// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { DocBlockClass } from "./classes.tsx";
import { type DocNode, type DocNodeFunction } from "../deps.ts";
import { DocBlockEnum } from "./enums.tsx";
import { DocBlockFn } from "./functions.tsx";
import { DocBlockInterface } from "./interfaces.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { DocBlockNamespace } from "./namespaces.tsx";
import { runtime } from "../services.ts";
import { DocBlockTypeAlias } from "./type_aliases.tsx";
import { type Child, take } from "./utils.ts";

export function DocBlock(
  { children, ...markdownContext }:
    & { children: Child<DocNode[]> }
    & MarkdownContext,
) {
  const docNodes = take(children, true);
  const elements = [];
  for (const docNode of docNodes) {
    switch (docNode.kind) {
      case "class":
        elements.push(
          <DocBlockClass {...markdownContext}>{docNode}</DocBlockClass>,
        );
        break;
      case "enum":
        elements.push(
          <DocBlockEnum {...markdownContext}>{docNode}</DocBlockEnum>,
        );
        break;
      case "interface":
        elements.push(
          <DocBlockInterface {...markdownContext}>{docNode}</DocBlockInterface>,
        );
        break;
      case "namespace":
        elements.push(
          <DocBlockNamespace {...markdownContext}>{docNode}</DocBlockNamespace>,
        );
        break;
      case "typeAlias":
        elements.push(
          <DocBlockTypeAlias {...markdownContext}>{docNode}</DocBlockTypeAlias>,
        );
        break;
    }
  }
  const fnNodes = docNodes.filter(({ kind }) =>
    kind === "function"
  ) as DocNodeFunction[];
  if (fnNodes.length) {
    elements.push(<DocBlockFn {...markdownContext}>{fnNodes}</DocBlockFn>);
  }
  return <div>{elements}</div>;
}
