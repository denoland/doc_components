// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNodeModuleDoc, type JsDoc as JsDocType } from "../deps.ts";
import { type Context, Markdown } from "./markdown.tsx";
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

export function getJsDocModule(
  JSDocModule?: Child<DocNodeTupleArray<DocNodeModuleDoc>>,
): JsDocType | undefined {
  if (!JSDocModule) {
    return undefined;
  }
  const moduleDoc = take(JSDocModule, true, true);
  const [[, { jsDoc }]] = moduleDoc;
  return jsDoc;
}
