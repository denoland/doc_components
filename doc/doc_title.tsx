// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { DocSubTitleClass } from "./classes.tsx";
import { type DocNode, tw } from "../deps.ts";
import { DocSubTitleInterface } from "./interfaces.tsx";
import { runtime } from "../services.ts";
import { type Child, decamelize, take } from "./utils.ts";
import { docNodeKindColors } from "./symbol_kind.tsx";
import { DocTypeParamsSummary } from "./types.tsx";
import { MarkdownContext } from "./markdown.tsx";

export function DocTitle(
  { children, markdownContext }: {
    children: Child<DocNode[]>;
    markdownContext: MarkdownContext;
  },
) {
  const docNodes = take(children, true);
  const elements = [];
  for (const docNode of [docNodes[0]]) {
    let title;
    let subTitle;
    switch (docNode.kind) {
      case "class":
        title = (
          <DocTypeParamsSummary markdownContext={markdownContext}>
            {docNode.classDef.typeParams}
          </DocTypeParamsSummary>
        );
        subTitle = (
          <DocSubTitleClass markdownContext={markdownContext}>
            {docNode}
          </DocSubTitleClass>
        );
        break;
      case "interface":
        title = (
          <DocTypeParamsSummary markdownContext={markdownContext}>
            {docNode.interfaceDef.typeParams}
          </DocTypeParamsSummary>
        );
        subTitle = (
          <DocSubTitleInterface markdownContext={markdownContext}>
            {docNode}
          </DocSubTitleInterface>
        );
        break;
      case "typeAlias":
        title = (
          <DocTypeParamsSummary markdownContext={markdownContext}>
            {docNode.typeAliasDef.typeParams}
          </DocTypeParamsSummary>
        );
        break;
    }

    elements.push(
      <div class={tw`font-medium space-y-1`}>
        <div class={tw`text-xl`}>
          <span class={tw`text-[${docNodeKindColors[docNode.kind][0]}]`}>
            {decamelize(docNode.kind)}
          </span>{" "}
          <span class={tw`font-bold`}>{docNode.name}</span>
          {title}
        </div>
        {subTitle && (
          <div class={tw`text-sm leading-4 space-y-0.5`}>
            {subTitle}
          </div>
        )}
      </div>,
    );
  }

  return <div>{elements}</div>;
}
