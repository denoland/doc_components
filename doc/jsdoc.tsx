// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNodeModuleDoc, type JsDoc as JsDocNode } from "../deps.ts";
import { Markdown, type MarkdownContext } from "./markdown.tsx";
import { runtime } from "../services.ts";
import { type Child, DocNodeTupleArray, take } from "./utils.ts";

export function JsDoc(
  { children, ...markdownContext }: {
    children: Child<JsDocNode | undefined>;
  } & MarkdownContext,
) {
  const jsDoc = take(children);
  if (!jsDoc) {
    return null;
  }
  return <Markdown {...markdownContext}>{jsDoc.doc}</Markdown>;
}

export function JsDocModule(
  { children, ...markdownContext }: {
    children: Child<DocNodeTupleArray<DocNodeModuleDoc>>;
  } & MarkdownContext,
) {
  const moduleDoc = take(children, true, true);
  const [[, { jsDoc }]] = moduleDoc;
  return <JsDoc {...markdownContext}>{jsDoc}</JsDoc>;
}
