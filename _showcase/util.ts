// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNode } from "../deps.ts";
import { type ModuleIndexWithDoc } from "../module_index.tsx";

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

let moduleIndex: ModuleIndexWithDoc | undefined;

export async function getModuleIndex(
  module: string,
  version: string,
): Promise<ModuleIndexWithDoc> {
  if (moduleIndex) {
    return moduleIndex;
  }
  const response = await fetch(
    `https://apiland.deno.dev/v2/modules/${module}/${version}/index/`,
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching module index.`);
  }
  return moduleIndex = await response.json();
}
