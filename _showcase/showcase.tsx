// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { apply, css, tw } from "./deps.ts";
import { CodeBlockClass } from "../classes.tsx";
import {
  type DocNode,
  type DocNodeClass,
  type DocNodeEnum,
  type DocNodeInterface,
} from "../deps.ts";
import { type IndexStructure } from "../doc.ts";
import { CodeBlockEnum } from "../enums.tsx";
import { CodeBlockInterface } from "../interfaces.tsx";
import { Tag } from "../jsdoc.tsx";
import { MarkdownSummary } from "../markdown.tsx";
import { ModuleDoc } from "../module_doc.tsx";
import { ModuleIndex } from "../module_index.tsx";
import { runtime } from "../services.ts";
import { SymbolDoc } from "../symbol_doc.tsx";
import { Usage } from "../usage.tsx";
import { type Child, take } from "../utils.ts";

const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

function ComponentTitle(
  { children, module }: { children: Child<string>; module: string },
) {
  const name = take(children);
  const href = `https://github.com/denoland/doc_components/blob/main${module}`;
  return (
    <h3 class={tw`text-xl py-4`} id={name.toLocaleLowerCase()}>
      <a
        href={href}
        class={tw`text-blue(800 dark:300) hover:underline`}
        target="_blank"
      >
        {name}
      </a>
    </h3>
  );
}

export function Showcase(
  { docNodes, indexStructure, symbol, url }: {
    docNodes: DocNode[];
    url: string;
    symbol: string;
    indexStructure: IndexStructure;
  },
) {
  const itemNodes = docNodes.filter(({ name }) => name === symbol);
  return (
    <div
      class={tw
        `h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 class={tw`text-3xl py-3`}>Deno Doc Components</h1>
      <h2 class={tw`text-2xl py-2`}>Component Showcase</h2>
      <hr />
      <ComponentTitle module="/markdown.tsx">MarkdownSummary</ComponentTitle>
      <MarkdownSummary url={url}>
        {`Some _markdown_ with [links](https://deno.land/) and symbol links, like: {@linkcode Router}`}
      </MarkdownSummary>
      <ComponentTitle module="/module_doc.tsx">ModuleDoc</ComponentTitle>
      <ModuleDoc url={url}>
        {docNodes}
      </ModuleDoc>
      <ComponentTitle module="/module_index.tsx">ModuleIndex</ComponentTitle>
      <ModuleIndex base="https://deno.land/std@0.138.0" path="/">
        {indexStructure}
      </ModuleIndex>
      <ComponentTitle module="/symbod_doc.ts">SymbolDoc</ComponentTitle>
      <SymbolDoc url={url}>{itemNodes}</SymbolDoc>
      <ComponentTitle module="/jsdoc.tsx">Tag</ComponentTitle>
      <Tag color="yellow">abstract</Tag>
      <Tag color="gray">deprecated</Tag>
      <ComponentTitle module="/usage.tsx">Usage</ComponentTitle>
      <Usage url="https://deno.land/x/example@v1.0.0/mod.ts" />
      <Usage
        url="https://deno.land/x/example@v1.0.0/mod.ts"
        name="MyClass"
      />
      <Usage
        url="https://deno.land/x/example@v1.0.0/mod.ts"
        name="namespace.MyClass"
      />
      <Usage
        url="https://deno.land/x/example@v1.0.0/mod.ts"
        name="Interface"
        isType
      />
    </div>
  );
}

export function ShowcaseCodeBlocks(
  { docNodes, url }: { docNodes: DocNode[]; url: string },
) {
  const classNode = docNodes.find(({ kind }) =>
    kind === "class"
  ) as DocNodeClass;
  const enumNode = docNodes.find(({ kind }) => kind === "enum") as DocNodeEnum;
  const interfaceNode = docNodes.find(({ kind }) =>
    kind === "interface"
  ) as DocNodeInterface;
  return (
    <div
      class={tw
        `h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 class={tw`text-3xl py-3`}>Deno Doc Components</h1>
      <h2 class={tw`text-2xl py-2`}>CodeBlock Component Showcase</h2>
      <hr />
      <ComponentTitle module="/classes.tsx">CodeBlockClass</ComponentTitle>
      <CodeBlockClass url={url}>{classNode}</CodeBlockClass>
      <ComponentTitle module="/enums.tsx">CodeBlockEnum</ComponentTitle>
      <CodeBlockEnum url={url}>{enumNode}</CodeBlockEnum>
      <ComponentTitle module="/interfaces.tsx">
        CodeBlockInterface
      </ComponentTitle>
      <CodeBlockInterface url={url}>{interfaceNode}</CodeBlockInterface>
    </div>
  );
}
