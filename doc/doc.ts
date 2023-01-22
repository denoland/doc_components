// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

/** Utilities for dealing with deno_doc structures and their derivatives.
 *
 * @module
 */

import { type DocNode, type DocNodeKind } from "../deps.ts";

const EXT = [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"];
const INDEX_MODULES = ["mod", "lib", "main", "index"].flatMap((idx) =>
  EXT.map((ext) => `${idx}${ext}`)
);

const KIND_ORDER: DocNodeKind[] = [
  "namespace",
  "class",
  "interface",
  "typeAlias",
  "variable",
  "function",
  "enum",
  "moduleDoc",
  "import",
];

export function byKind(a: DocNode, b: DocNode): number {
  return KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
}

export function byKindValue(a: DocNodeKind, b: DocNodeKind): number {
  return KIND_ORDER.indexOf(a) - KIND_ORDER.indexOf(b);
}

/** Given a set of paths which are expected to be siblings within a folder/dir
 * return what appears to be the "index" module. If none can be identified,
 * `undefined` is returned. */
export function getIndex(paths: string[]): string | undefined {
  for (const index of INDEX_MODULES) {
    const item = paths.find((file) => file.toLowerCase().endsWith(`/${index}`));
    if (item) {
      return item;
    }
  }
}
