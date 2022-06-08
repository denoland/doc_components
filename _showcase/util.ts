// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNode } from "../deps.ts";
import { getPaths } from "../doc.ts";

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

let entries: Record<string, DocNode[]> | undefined;

export async function getEntries(
  index: Record<string, string[]>,
): Promise<Record<string, DocNode[]>> {
  if (entries) {
    return entries;
  }
  const paths = getPaths(index);
  console.log(JSON.stringify(paths));
  const response = await fetch(
    "https://apiland.deno.dev/v2/modules/std/0.142.0/doc",
    {
      method: "POST",
      body: JSON.stringify(paths),
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    },
  );
  return entries = response.status === 200 ? await response.json() : {};
}

let index: Record<string, string[]> | undefined;

export async function getIndex(): Promise<Record<string, string[]>> {
  if (index) {
    return index;
  }
  const response = await fetch(
    "https://apiland.deno.dev/v2/modules/std/0.142.0/index/",
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching module index.`);
  }
  return index = await response.json();
}
