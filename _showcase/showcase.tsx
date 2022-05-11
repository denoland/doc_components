// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { apply, css, tw } from "./deps.ts";
import { runtime } from "../services.ts";
import { getIndexStructure } from "./util.ts";

import { Tag } from "../jsdoc.tsx";
import { MarkdownSummary } from "../markdown.tsx";
import { ModuleIndex } from "../module_index.tsx";

const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

const indexStructure = await getIndexStructure();

function ComponentTitle(
  { children, module }: { children: string; module: string },
) {
  const href = `https://github.com/denoland/doc_components/blob/main${module}`;
  return (
    <h3 class={tw`text-xl py-4`}>
      <a
        href={href}
        class={tw`text-blue(800 dark:300) hover:underline`}
        target="_blank"
      >
        {children}
      </a>
    </h3>
  );
}

export function Showcase() {
  return (
    <div
      class={tw
        `h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 class={tw`text-3xl py-3`}>Deno Doc Components</h1>
      <h2 class={tw`text-2xl py-2`}>Component Showcase</h2>
      <hr />
      <ComponentTitle module="/markdown.tsx">MarkdownSummary</ComponentTitle>
      <MarkdownSummary path="/">
        {`Some _markdown_ with [links](https://deno.land/)`}
      </MarkdownSummary>
      <ComponentTitle module="/module_index.tsx">ModuleIndex</ComponentTitle>
      <ModuleIndex>{indexStructure}</ModuleIndex>
      <ComponentTitle module="/jsdoc.tsx">Tag</ComponentTitle>
      <Tag color="yellow">abstract</Tag>
      <Tag color="gray">deprecated</Tag>
    </div>
  );
}
