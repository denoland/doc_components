// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { DocSubTitleClass } from "./classes.tsx";
import { type DocNode, type DocNodeFunction, tw } from "../deps.ts";
import { DocSubTitleInterface } from "./interfaces.tsx";
import { runtime } from "../services.ts";
import { DocBlockTypeAlias } from "./type_aliases.tsx";
import { type Child, take } from "./utils.ts";
import { docNodeKindColors } from "./symbol_kind.tsx";
import { DocTypeParams } from "./types.tsx";

export function DocTitle({ children }: { children: Child<DocNode[]> }) {
  const docNodes = take(children, true);
  const elements = [];
  for (const docNode of [docNodes[0]]) {
    let title;
    let subTitle;
    switch (docNode.kind) {
      case "class":
        title = <DocTypeParams>{docNode.classDef.typeParams}</DocTypeParams>;
        subTitle = <DocSubTitleClass>{docNode}</DocSubTitleClass>;
        break;
      case "interface":
        title = (
          <DocTypeParams>{docNode.interfaceDef.typeParams}</DocTypeParams>
        );
        subTitle = <DocSubTitleInterface>{docNode}</DocSubTitleInterface>;
        break;
      case "typeAlias":
        elements.push(
          <DocBlockTypeAlias {...markdownContext}>{docNode}</DocBlockTypeAlias>,
        );
        break;
    }

    elements.push(
      <div class={tw`font-medium space-y-1`}>
        <div class={tw`text-xl`}>
          <span class={tw`text-[${docNodeKindColors[docNode.kind][0]}]`}>
            {docNode.kind}
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
