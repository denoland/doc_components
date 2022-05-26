// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNode } from "../deps.ts";
import { type IndexStructure, SerializeMap } from "../doc.ts";

let docNodes: DocNode[] | undefined;

export async function getDocNodes(): Promise<DocNode[]> {
  if (docNodes) {
    return docNodes;
  }
  const response = await fetch(
    "https://apiland.deno.dev/v2/modules/oak/v10.5.1/doc/mod.ts",
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching doc nodes.`);
  }
  return docNodes = await response.json();
}

let indexStructure: IndexStructure | undefined;

export async function getIndexStructure(): Promise<IndexStructure> {
  if (indexStructure) {
    return indexStructure;
  }
  const data = await Deno.readTextFile(
    new URL("./data/index_structure.json", import.meta.url),
  );
  return indexStructure = JSON.parse(
    data,
    (key, value) =>
      typeof value === "object" && (key === "structure" || key === "entries")
        ? new SerializeMap(Object.entries(value))
        : value,
  );
}
