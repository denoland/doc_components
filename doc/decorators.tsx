// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DecoratorDef } from "../deps.ts";
import {
  Anchor,
  DocEntry,
  nameToId,
  SectionSubTitle,
  SectionTitle,
} from "./doc_common.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, maybe, take } from "./utils.ts";

function Decorator(
  { children, code, url, namespace }: {
    children: Child<DecoratorDef>;
    code?: boolean;
    url: string;
    namespace?: string;
  },
) {
  const { name, args } = take(children);
  const href = services.lookupHref(url, namespace, name);
  const cl = code ? "codeDecorator" : "decorator";
  return (
    <div>
      @<span class={style(cl)}>
        {maybe(href, <a href={href} class={style("linkType")}>{name}</a>, name)}
      </span>
      <DecoratorArgs>{args}</DecoratorArgs>
    </div>
  );
}

function DecoratorArgs(
  { children }: { children: Child<string[] | undefined> },
) {
  const args = take(children, true);
  if (!args || !args.length || !args[0]) {
    return null;
  }
  return <span>({args.join(", ")})</span>;
}

export function Decorators(
  { children, ...props }: {
    children: Child<DecoratorDef[] | undefined>;
    url: string;
    namespace?: string;
  },
) {
  const decorators = take(children, true);
  if (!decorators || !decorators.length) {
    return null;
  }

  return (
    <div>
      {decorators.map((decorator) => (
        <Decorator code {...props}>{decorator}</Decorator>
      ))}
    </div>
  );
}

export function DecoratorDoc(
  { children, ...markdownContext }:
    & { children: Child<DecoratorDef[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map((def) => {
    const id = nameToId("decorator", def.name);
    return (
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocEntry location={def.location}>
          <Decorator {...markdownContext}>{def}</Decorator>
        </DocEntry>
      </div>
    );
  });
  return (
    <>
      <SectionTitle>Decorators</SectionTitle>
      {items}
    </>
  );
}

export function DecoratorSubDoc(
  { children, id, ...markdownContext }: {
    children: Child<DecoratorDef[]>;
    id: string;
  } & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map((def) => {
    const itemId = nameToId(`${id}_decorator`, def.name);
    return (
      <div class={style("docSubItem")} id={itemId}>
        <Anchor>{itemId}</Anchor>
        <DocEntry location={def.location}>
          <Decorator {...markdownContext}>{def}</Decorator>
        </DocEntry>
      </div>
    );
  });

  return (
    <>
      <SectionSubTitle id={id}>Decorators</SectionSubTitle>
      {items}
    </>
  );
}
