// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { apply, css, type Directive, tw } from "./deps.ts";

const codeStyles = css({
  ":not(pre) > code": apply
    `font-mono text-sm py-1 px-1.5 rounded text-black bg-gray-100 dark:(text-white bg-gray-800)`,
  pre: apply
    `font-mono text-sm p-2.5 rounded-lg text-black bg-gray-100 dark:(text-white bg-gray-800) overflow-x-auto`,
});

const markdownStyles = css({
  a: apply`underline`,
  h1: apply`text-xl md:text-2xl lg:text-3xl`,
  h2: apply`text-lg md:text-xl lg:text-2xl`,
  h3: apply`font-bold md:(text-lg font-normal) lg:(text-xl font-normal)`,
  h4: apply`font-semibold md:(font-bold) lg:(text-lg font-normal)`,
  h5: apply`font-italic md:(font-semibold) lg:(font-bold)`,
  h6: apply`md:(font-italic) lg:(font-semibold)`,
  hr: apply`m-2 border-gray(500 dark:400)`,
  ol: apply`list-decimal lg:list-inside`,
  p: apply`my-1`,
  table: apply`table-auto`,
  td: apply`p-2 border border(solid gray(500 dark:400))`,
  th: apply`font-bold text-center`,
  ul: apply`lg:(list-disc list-inside)`,
});

const syntaxHighlightingStyles = css({
  ".code-comment": apply`text-gray(500 dark:400)`,
  ".code-function": apply`text-green(700 dark:300)`,
  ".code-literal": apply`text-cyan(600 dark:400)`,
  ".code-keyword, .code-operator, .code-variable.code-language": apply
    `text-purple(800 dark:300)`,
  ".code-number, .code-doctag": apply`text-indigo(600 dark:400)`,
  ".code-regexp": apply`text-red(700 dark:300)`,
  ".code-string": apply`text-yellow(500 dark:200)`,
  ".code-type, .code-built_in": apply`text-cyan(600 dark:400) italic`,
});

const styles = {
  copyButton: apply
    `float-right px-2 font-sans focus-visible:ring-2 text-sm text-gray(500 dark:300) border border-gray(300 dark:500) rounded hover:shadow`,
  link: apply`text-blue(800 dark:300) hover:underline`,
  linkPadRight: apply`pr-4 text-blue(800 dark:300) hover:underline`,
  main: apply`p-6 md:(col-span-3 p-12)`,
  markdown: apply
    `p-4 flex flex-col space-y-4 text-justify ${markdownStyles} ${codeStyles} ${syntaxHighlightingStyles}`,
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
  section: apply`text-2xl border(b gray(400 dark:600)) p-2 mt-1 mb-3`,
  subSection: apply`text-xl p-2 mx-2.5 mt-1 mb-2.5`,
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

export function style(name: StyleKey): string;
// deno-lint-ignore no-explicit-any
export function style(name: StyleKey, raw: boolean): string | Directive<any>;
// deno-lint-ignore no-explicit-any
export function style(name: StyleKey, raw: true): Directive<any>;
export function style(
  name: StyleKey,
  raw = false,
  // deno-lint-ignore no-explicit-any
): string | Directive<any> {
  if (raw) {
    return styles[name];
  }
  return tw`${styles[name]}`;
}
