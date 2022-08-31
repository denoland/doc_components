// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { apply, css, tw } from "./deps.ts";
import { Tag } from "../doc/doc_common.tsx";
import { DocBlockClass } from "../doc/classes.tsx";
import {
  type DocNode,
  type DocNodeClass,
  type DocNodeEnum,
  type DocNodeFunction,
  type DocNodeInterface,
  type DocNodeNamespace,
  type DocNodeTypeAlias,
} from "../deps.ts";
import { DocBlockEnum } from "../doc/enums.tsx";
import { DocBlockFunction } from "../doc/functions.tsx";
import { DocBlockInterface } from "../doc/interfaces.tsx";
import { MarkdownSummary } from "../doc/markdown.tsx";
import { ModuleDoc } from "../doc/module_doc.tsx";
import { ModuleIndex } from "../doc/module_index.tsx";
import { ModuleIndexPanel } from "../doc/module_index_panel.tsx";
import { runtime } from "../services.ts";
import { SymbolDoc } from "../doc/symbol_doc.tsx";
import { DocBlockTypeAlias } from "../doc/type_aliases.tsx";
import { Usage } from "../doc/usage.tsx";
import { type Child, take } from "../doc/utils.ts";
import { DocBlockNamespace } from "../doc/namespaces.tsx";

// deno-lint-ignore no-explicit-any
type ModuleIndexWithDoc = any;

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
      <ModuleIndex
        base="https://deno.land/std@0.142.0"
        sourceUrl="https://deno.land/std@0.142.0"
      >
        {moduleIndex}
      </ModuleIndex>
      <ModuleIndexPanel
        base="https://deno.land/std@0.142.0"
        path="/"
        current="/version.ts"
      >
        {moduleIndex}
      </ModuleIndexPanel>
      <ComponentTitle module="/symbod_doc.ts">SymbolDoc</ComponentTitle>
      <SymbolDoc url={url}>{itemNodes}</SymbolDoc>
      <ComponentTitle module="/jsdoc.tsx">Tag</ComponentTitle>
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
  const fnNodes = docNodes.filter(({ kind }) =>
    kind === "function"
  ) as DocNodeFunction[];
  const typeAliasNode = docNodes.find(({ kind }) =>
    kind === "typeAlias"
  ) as DocNodeTypeAlias;
  const namespaceNode = docNodes.find(({ kind }) =>
    kind === "namespace"
  ) as DocNodeNamespace;
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
      <ComponentTitle module="/functions.tsx">DocBlockFn</ComponentTitle>
      <DocBlockFunction url={url}>{fnNodes}</DocBlockFunction>
      <ComponentTitle module="/type_alias.tsx">DocNodeTypeAlias</ComponentTitle>
      <DocBlockTypeAlias url={url}>{typeAliasNode}</DocBlockTypeAlias>
      <ComponentTitle module="/namespace.tsx">DocBlockNamespace</ComponentTitle>
      <DocBlockNamespace url={url}>{namespaceNode}</DocBlockNamespace>
    </div>
  );
}
