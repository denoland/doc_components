// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNodeModuleDoc } from "../deps.ts";
import { type Context, Markdown } from "./markdown.tsx";
import { runtime } from "../services.ts";
import { type Child, DocNodeTupleArray, take } from "./utils.ts";

export function JsDoc(
  { children, context }: {
    children: Child<{ doc?: string } | undefined>;
    context: Context;
  },
) {
  const jsDoc = take(children);
  if (!jsDoc) {
    return null;
  }
  return <Markdown context={context}>{jsDoc.doc}</Markdown>;
}

export function JsDocModule(
  { children, context }: {
    children: Child<DocNodeTupleArray<DocNodeModuleDoc>>;
    context: Context;
  },
) {
  const moduleDoc = take(children, true, true);
  const [[, { jsDoc }]] = moduleDoc;
  return <JsDoc context={context}>{jsDoc}</JsDoc>;
}
