// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type IndexStructure, SerializeMap } from "../doc.ts";

export async function getIndexStructure(): Promise<IndexStructure> {
  const data = await Deno.readTextFile(
    new URL("./data/index_structure.json", import.meta.url),
  );
  return JSON.parse(
    data,
    (key, value) =>
      typeof value === "object" && (key === "structure" || key === "entries")
        ? new SerializeMap(Object.entries(value))
        : value,
  );
}
