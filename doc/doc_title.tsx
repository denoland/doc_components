// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { DocTitleClass } from "./classes.tsx";
import { type DocNode, type DocNodeFunction, tw } from "../deps.ts";
import { DocBlockEnum } from "./enums.tsx";
import { DocTitleFn } from "./functions.tsx";
import { DocTitleInterface } from "./interfaces.tsx";
import { DocBlockNamespace } from "./namespaces.tsx";
import { runtime } from "../services.ts";
import { DocBlockTypeAlias } from "./type_aliases.tsx";
import { type Child, take } from "./utils.ts";
import { docNodeKindColors } from "./symbol_kind.tsx";

export function DocTitle({ children }: { children: Child<DocNode[]> }) {
  const docNodes = take(children, true);
  const elements = [];
  for (const docNode of docNodes) {
    let fn;
    switch (docNode.kind) {
      case "class":
        fn = <DocTitleClass>{docNode}</DocTitleClass>;
        break;
      case "interface":
        fn = <DocTitleInterface>{docNode}</DocTitleInterface>;
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

    elements.push(
      <div class={tw`text-xl leading-8 font-medium`}>
        <span class={tw`text-[${docNodeKindColors[docNode.kind][0]}]`}>
          {docNode.kind}
        </span>{" "}
        <span class={tw`font-bold`}>{docNode.name}</span>
        {fn}
      </div>,
    );
  }
  const fnNodes = docNodes.filter(({ kind }) =>
    kind === "function"
  ) as DocNodeFunction[];
  if (fnNodes.length) {
    elements.push(<DocTitleFn>{fnNodes}</DocTitleFn>);
  }
  return <div>{elements}</div>;
}
