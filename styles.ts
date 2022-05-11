// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { apply, css, type Directive, tw } from "./deps.ts";

const styles = {
  link: apply`text-blue(800 dark:300) hover:underline`,
  linkPadRight: apply`pr-4 text-blue(800 dark:300) hover:underline`,
  main: apply`p-6 md:(col-span-3 p-12)`,
  markdownSummary: apply`text-gray(600 dark:400) ${
    css({
      "p": apply`inline-block`,
      "a": apply`text-blue(700 dark:400) hover:underline`,
    })
  }`,
  panel: css({
    "& > input:checked ~ table": apply`hidden`,
    "& > input:checked ~ label > svg": apply`rotate-0`,
  }),
  panelTitle: apply`block p-2 border(b gray(400 dark:600)) cursor-pointer`,
  symbolClass: apply`text-green(800 dark:400) font-bold hover:underline`,
  symbolEnum: apply`text-green(700 dark:500) font-bold hover:underline`,
  symbolFunction: apply`text-cyan(800 dark:400) font-bold hover:underline`,
  symbolInterface: apply`text-cyan(900 dark:300) font-bold hover:underline`,
  symbolNamespace: apply`text-yellow(800 dark:400) font-bold hover:underline`,
  symbolTypeAlias: apply`text-yellow(700 dark:500) font-bold hover:underline`,
  symbolVariable: apply`text-blue(700 dark:500) font-bold hover:underline`,
  tag: apply
    `px-4 py-2 inline-flex leading-5 font-semibold lowercase rounded-full`,
  tdIndex: apply`py-1 px-2 align-top`,
  rightArrow: apply`inline rotate-90 dark:(filter invert) mr-2`,
} as const;

type StyleKey = keyof typeof styles;

const styleCache = new Map<StyleKey, string>();

export function style(
  name: StyleKey,
  raw = false,
  // deno-lint-ignore no-explicit-any
): string | Directive<any> {
  if (raw) {
    return styles[name];
  }
  if (!styleCache.has(name)) {
    const value = tw`${styles[name]}`;
    styleCache.set(name, value);
  }
  return styleCache.get(name)!;
}
