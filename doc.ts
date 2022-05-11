// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** Utilities for dealing with deno_doc structures and their derivatives.
 *
 * @module
 */

import { type DocNode, type DocNodeClass } from "./deps.ts";

/** A utility class that extends {@linkcode Map} that allows serialization to
 * JSON. */
export class SerializeMap<V> extends Map<string, V> {
  toJSON(): Record<string, V> {
    return Object.fromEntries(this.entries());
  }
}

/** An object which represents an "index" of a module. */
export interface IndexStructure {
  /** An object that describes the structure of the module, where the key is
   * the containing folder and the value is an array of module files that
   * represent the the "contents" of the folder. */
  structure: SerializeMap<string[]>;
  /** For modules in the structure, any doc node entries available for each
   * module file. */
  entries: SerializeMap<DocNode[]>;
}

/** If a doc node has JSDoc, return the first paragraph of the JSDoc doc. */
export function getDocSummary(docNode: DocNode): string | undefined {
  if (docNode.jsDoc?.doc) {
    const [summary] = docNode.jsDoc.doc.split("\n\n");
    return summary;
  }
}

export function isAbstract(node: DocNode): node is DocNodeClass {
  if (node.kind === "class") {
    return node.classDef.isAbstract;
  } else {
    return false;
  }
}

export function isDeprecated(node: DocNode): boolean {
  if (node.jsDoc && node.jsDoc.tags) {
    return !!node.jsDoc.tags.find(({ kind }) => kind === "deprecated");
  }
  return false;
}
