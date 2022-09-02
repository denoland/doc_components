// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

export async function getModuleDoc(): Promise<any> {
  const response = await fetch(
    "https://apiland.deno.dev/v2/pages/mod/doc/oak/v11.0.0/mod.ts",
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching doc nodes.`);
  }
  return response.json();
}

export async function getSymbolDoc(): Promise<any> {
  const response = await fetch(
    "https://apiland.deno.dev/v2/pages/mod/doc/oak/v11.0.0/mod.ts?symbol=Router",
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching doc nodes.`);
  }
  return response.json();
}

export async function getModuleIndex(): Promise<any> {
  const response = await fetch(
    "https://apiland.deno.dev/v2/pages/mod/doc/std/0.154.0/",
  );
  if (response.status !== 200) {
    console.error(response);
    throw new Error(`Unexpected result fetching module index.`);
  }
  return response.json();
}
