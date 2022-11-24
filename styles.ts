// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { apply, css, type Directive, tw } from "./deps.ts";

export const comrakStyles = css({
  // code
  ":not(pre) > code": apply`font-mono text-sm py-1 px-1.5 rounded bg-gray-100`,
  pre:
    apply`font-mono text-sm p-2.5 rounded-lg text-black bg-gray-100 overflow-x-auto`,

  // general
  a: apply`link`,
  h1: apply`text-xl md:text-2xl lg:text-3xl`,
  h2: apply`text-lg md:text-xl lg:text-2xl`,
  h3: apply`font-bold md:(text-lg font-normal) lg:(text-xl font-normal)`,
  h4: apply`font-semibold md:font-bold lg:(text-lg font-normal)`,
  h5: apply`font-italic md:font-semibold lg:font-bold`,
  h6: apply`md:font-italic lg:font-semibold`,
  hr: apply`m-2 border-gray-500`,
  ol: apply`list-decimal lg:list-inside`,
  p: apply`my-1`,
  table: apply`table-auto`,
  td: apply`p-2 border border(solid gray-500)`,
  th: apply`font-bold text-center`,
  ul: apply`lg:(list-disc list-inside)`,

  // syntax highlighting
  ".code-comment": apply`text-gray-500`,
  ".code-function": apply`text-green-700`,
  ".code-literal": apply`text-cyan-600`,
  ".code-keyword, .code-operator, .code-variable.code-language":
    apply`text-purple-800`,
  ".code-number, .code-doctag": apply`text-indigo-600`,
  ".code-regexp": apply`text-red-700`,
  ".code-string": apply`text-yellow-500`,
  ".code-type, .code-built_in": apply`text-cyan-600 italic`,
});

const styles = {
  anchor:
    apply`float-left leading-none group-hover:block text-gray-600 -ml-[18px] pr-[4px]`,
  copyButton: apply`rounded border border-[#D2D2DC] p-1.5 hover:bg-border`,
  details: apply`${css({
    "& > summary": apply`list-none`,
    "& > summary::-webkit-details-marker": apply`hidden`,
    "&[open] svg": apply`rotate-90`,
  })}`,
  docBlockItems: apply`space-y-7`,
  docEntry: apply`flex justify-between`,
  docEntryChildren: apply`break-words flex items-center gap-2`,
  docItem: apply`group relative`,
  indent: apply`ml-4`,
  main: apply`space-y-7 md:(col-span-3)`,
  markdown: apply`flex flex-col space-y-4 text-justify`,
  markdownSummary: apply`inline text-gray-600 ${
    css({
      "p": apply`inline-block`,
    })
  }`,
  moduleDoc: apply`space-y-6`,
  moduleDocHeader: apply`flex justify-between mb-8`,
  moduleIndex: apply`rounded-lg w-full border border-[#E5E7EB]`,
  moduleIndexHeader: apply`flex justify-between items-center py-3.5 pr-5`,
  moduleIndexHeaderTitle: apply`ml-5 font-semibold text-lg flex items-center`,
  moduleIndexHeaderTitleSpan: apply`ml-2 leading-none`,
  moduleIndexTable: apply`block lg:table w-full`,
  moduleIndexRow: apply`block lg:table-row odd:bg-[#F8F7F6]`,
  moduleIndexLinkCell:
    apply`block lg:table-cell pl-5 pr-3 py-2.5 font-semibold`,
  moduleIndexLinkCellIcon: apply`inline my-1.5 mr-3`,
  moduleIndexDocCell:
    apply`block lg:(table-cell pl-0 pt-2.5 mt-0) pl-11 pr-[1.375rem] pb-2.5 -mt-2 text-[#9CA0AA]`,
  moduleIndexPanel: apply`lg:w-72 flex-shrink-0`,
  moduleIndexPanelActive: apply`bg-gray-100 font-bold`,
  moduleIndexPanelEntry:
    apply`flex items-center gap-2 py-2 px-3 rounded-lg w-full leading-6 hover:(text-gray-500  bg-gray-50) children:last-child:(truncate flex-shrink-1)`,
  moduleIndexPanelModuleIndex: apply`text-[#6C6E78] font-light`,
  moduleIndexPanelSymbol:
    apply`flex items-center justify-between gap-1 py-1.5 pl-2.5 pr-3 rounded-lg w-full leading-6 hover:(text-gray-500 bg-gray-50) children:first-child:(flex items-center gap-2 min-w-0 children:last-child:truncate)`,
  section: apply`text-sm leading-6 font-semibold text-gray-400 py-1`,
  symbolDoc: apply`space-y-12 md:(col-span-3)`,
  symbolDocHeader: apply`flex justify-between items-start`,
  symbolKind:
    apply`rounded-full w-6 h-6 inline-flex items-center justify-center font-medium text-xs leading-none flex-shrink-0 select-none`,
  sourceLink:
    apply`pl-2 break-words text-gray-600 hover:text-gray-800 hover:underline`,
  symbolListCellSymbol:
    apply`block lg:table-cell py-1 pr-3 text-[#232323] font-bold children:(space-x-2 min-w-[13rem] flex items-center)`,
  symbolListCellDoc: apply`block lg:table-cell py-1 text-sm text-[#9CA0AA]`,
  symbolListRow: apply`block lg:table-row`,
  symbolListTable: apply`block lg:table`,
  symbolKindDisplay:
    apply`w-11 flex-none flex children:(not-first-child:-ml-[7px])`,
  tag:
    apply`inline-flex items-center gap-0.5 children:flex-none rounded-full font-medium text-sm leading-none font-sans`,
} as const;

export type StyleKey = keyof typeof styles;

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
