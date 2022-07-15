// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { DocBlockClass } from "./classes.tsx";
import { type DocNode, type DocNodeFunction } from "./deps.ts";
import { type MarkdownContext } from "./markdown.tsx";
import { runtime } from "./services.ts";
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
    }
  }
  return <div>{elements}</div>;
}
