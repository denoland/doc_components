// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNodeModuleDoc } from "../deps.ts";
import { Markdown, type MarkdownContext } from "./markdown.tsx";
import { runtime } from "../services.ts";
import { type Child, DocNodeTupleArray, take } from "./utils.ts";

export function JsDoc(
  { children, markdownContext }: {
    children: Child<{ doc?: string } | undefined>;
    markdownContext: MarkdownContext;
  },
) {
  const jsDoc = take(children);
  if (!jsDoc) {
    return null;
  }
  return <Markdown markdownContext={markdownContext}>{jsDoc.doc}</Markdown>;
}

export function JsDocModule(
  { children, markdownContext }: {
    children: Child<DocNodeTupleArray<DocNodeModuleDoc>>;
    markdownContext: MarkdownContext;
  },
) {
  const moduleDoc = take(children, true, true);
  const [[, { jsDoc }]] = moduleDoc;
  return <JsDoc markdownContext={markdownContext}>{jsDoc}</JsDoc>;
}
