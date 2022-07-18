// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { apply, css, tw } from "./deps.ts";
import { Tag } from "../doc_common.tsx";
import { CodeBlockClass, DocBlockClass } from "../classes.tsx";
import {
  type DocNode,
  type DocNodeClass,
  type DocNodeEnum,
  type DocNodeFunction,
  type DocNodeInterface,
  type DocNodeTypeAlias,
  type DocNodeVariable,
} from "../deps.ts";
import { CodeBlockEnum, DocBlockEnum } from "../enums.tsx";
import { CodeBlockFn } from "../functions.tsx";
import { CodeBlockInterface, DocBlockInterface } from "../interfaces.tsx";
import { MarkdownSummary } from "../markdown.tsx";
import { ModuleDoc } from "../module_doc.tsx";
import { ModuleIndexWithDoc, ModulePathIndex } from "../module_path_index.tsx";
import { ModulePathIndexPanel } from "../module_path_index_panel.tsx";
import { runtime } from "../services.ts";
import { SymbolDoc } from "../symbol_doc.tsx";
import { CodeBlockTypeAlias } from "../type_aliases.tsx";
import { Usage } from "../usage.tsx";
import { type Child, take } from "../utils.ts";
import { CodeBlockVariable } from "../variables.tsx";

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
  { docNodes, moduleIndex, symbol, url }: {
    docNodes: DocNode[];
    url: string;
    symbol: string;
    moduleIndex: ModuleIndexWithDoc;
  },
) {
  const itemNodes = docNodes.filter(({ name }) => name === symbol);
  return (
    <div
      class={tw`h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 class={tw`text-3xl py-3`}>Deno Doc Components</h1>
      <h2 class={tw`text-2xl py-2`}>Component Showcase</h2>
      <hr />
      <ComponentTitle module="/markdown.tsx">MarkdownSummary</ComponentTitle>
      <MarkdownSummary url={url}>
        {`Some _markdown_ with [links](https://deno.land/) and symbol links, like: {@linkcode Router}`}
      </MarkdownSummary>
      <ComponentTitle module="/module_doc.tsx">ModuleDoc</ComponentTitle>
      <ModuleDoc url={url} sourceUrl={url}>
        {docNodes}
      </ModuleDoc>
      <ComponentTitle module="/module_index.tsx">ModuleIndex</ComponentTitle>
      <ModulePathIndex
        base="https://deno.land/std@0.142.0"
        sourceUrl="https://deno.land/std@0.142.0"
      >
        {moduleIndex}
      </ModulePathIndex>
      <ModulePathIndexPanel
        base="https://deno.land/std@0.142.0"
        current="/version.ts"
      >
        {moduleIndex}
      </ModulePathIndexPanel>
      <ComponentTitle module="/symbod_doc.ts">SymbolDoc</ComponentTitle>
      <SymbolDoc url={url}>{itemNodes}</SymbolDoc>
      <ComponentTitle module="/jsdoc.tsx">Tag</ComponentTitle>
      <Tag color="yellow">abstract</Tag>
      <Tag color="gray">👎 deprecated</Tag>
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

export function ShowcaseDocBlocks(
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
      class={tw`h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 class={tw`text-3xl py-3`}>Deno Doc Components</h1>
      <h2 class={tw`text-2xl py-2`}>CodeBlock Component Showcase</h2>
      <hr />
      <ComponentTitle module="/classes.tsx">DocBlockClass</ComponentTitle>
      <DocBlockClass url={url}>{classNode}</DocBlockClass>
      <ComponentTitle module="/enum.tsx">DocBlockEnum</ComponentTitle>
      <DocBlockEnum url={url}>{enumNode}</DocBlockEnum>
      <ComponentTitle module="/interfaces.tsx">
        DocBlockInterface
      </ComponentTitle>
      <DocBlockInterface url={url}>{interfaceNode}</DocBlockInterface>
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
  const typeAliasNode = docNodes.find(({ kind }) =>
    kind === "typeAlias"
  ) as DocNodeTypeAlias;
  const variableNode = docNodes.find(({ kind }) =>
    kind === "variable"
  ) as DocNodeVariable;
  const fnName = docNodes.find(({ kind }) => kind === "function")?.name;
  const fnNodes = docNodes.filter(({ kind, name }) =>
    kind === "function" && name === fnName
  ) as DocNodeFunction[];
  return (
    <div
      class={tw`h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 class={tw`text-3xl py-3`}>Deno Doc Components</h1>
      <h2 class={tw`text-2xl py-2`}>CodeBlock Component Showcase</h2>
      <hr />
      <ComponentTitle module="/classes.tsx">CodeBlockClass</ComponentTitle>
      <CodeBlockClass url={url}>{classNode}</CodeBlockClass>
      <ComponentTitle module="/enums.tsx">CodeBlockEnum</ComponentTitle>
      <CodeBlockEnum url={url}>{enumNode}</CodeBlockEnum>
      <ComponentTitle module="/functions.tsx">CodeBlockFn</ComponentTitle>
      <CodeBlockFn url={url}>{fnNodes}</CodeBlockFn>
      <ComponentTitle module="/interfaces.tsx">
        CodeBlockInterface
      </ComponentTitle>
      <CodeBlockInterface url={url}>{interfaceNode}</CodeBlockInterface>
      <ComponentTitle module="/type_aliases.tsx">
        CodeBlockTypeAlias
      </ComponentTitle>
      <CodeBlockTypeAlias url={url}>{typeAliasNode}</CodeBlockTypeAlias>
      <ComponentTitle module="/variables.tsx">CodeBlockVariable</ComponentTitle>
      <CodeBlockVariable url={url}>{variableNode}</CodeBlockVariable>
    </div>
  );
}
