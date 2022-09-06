// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { DocSubTitleClass } from "./classes.tsx";
import { type DocNode, tw } from "../deps.ts";
import { DocSubTitleInterface } from "./interfaces.tsx";
import { runtime } from "../services.ts";
import { type Child, decamelize, take } from "./utils.ts";
import { docNodeKindColors } from "./symbol_kind.tsx";
import { MarkdownContext } from "./markdown.tsx";

export function DocTitle(
  { children, property, markdownContext }: {
    children: Child<DocNode>;
    property?: string;
    markdownContext: MarkdownContext;
  },
) {
  const docNode = take(children, true);
  let subTitle;
  switch (docNode.kind) {
    case "class":
      subTitle = (
        <DocSubTitleClass markdownContext={markdownContext}>
          {docNode}
        </DocSubTitleClass>
      );
      break;
    case "interface":
      subTitle = (
        <DocSubTitleInterface markdownContext={markdownContext}>
          {docNode}
        </DocSubTitleInterface>
      );
      break;
  }

  return (
    <div class={tw`font-medium space-y-1`}>
      <div class={tw`text-xl`}>
        <span
          class={tw`text-[${
            docNodeKindColors[property ? "function" : docNode.kind][0]
          }]`}
        >
          {decamelize(property ? "method" : docNode.kind)}
        </span>{" "}
        <span class={tw`font-bold`}>{property ?? docNode.name}</span>
      </div>
      {subTitle && (
        <div class={tw`text-sm leading-4 space-y-0.5`}>
          {subTitle}
        </div>
      )}
    </div>
  );
}
