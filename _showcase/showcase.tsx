// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type IndexStructure } from "../doc.ts";
import { Tag } from "../jsdoc.tsx";
import { MarkdownSummary } from "../markdown.tsx";
import { ModuleIndex } from "../module_index.tsx";
import { apply, css, runtime, tw } from "../services.ts";
import { type Child, take } from "../utils.ts";

const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

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

export function Showcase({ children }: { children: Child<IndexStructure> }) {
  const indexStructure = take(children);
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
