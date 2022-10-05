// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

// deno-lint-ignore-file no-explicit-any

/** @jsx runtime.h */
import { apply, css, tw } from "./deps.ts";
import { tagVariants } from "../doc/doc_common.tsx";
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
import { Markdown } from "../doc/markdown.tsx";
import { ModuleDoc } from "../doc/module_doc.tsx";
import { ModuleIndex } from "../doc/module_index.tsx";
import { ModuleIndexPanel } from "../doc/module_index_panel.tsx";
import { runtime } from "../services.ts";
import { SymbolDoc } from "../doc/symbol_doc.tsx";
import { DocBlockTypeAlias } from "../doc/type_aliases.tsx";
import { Usage } from "../doc/usage.tsx";
import { type Child, take } from "../doc/utils.ts";
import { DocBlockNamespace } from "../doc/namespaces.tsx";

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
  { moduleIndex, moduleDoc, symbolDoc, symbol, url }: {
    url: URL;
    symbol: string;
    moduleIndex: any;
    moduleDoc: any;
    symbolDoc: any;
  },
) {
  return (
    <div
      class={tw`h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 class={tw`text-3xl py-3`}>Deno Doc Components</h1>
      <h2 class={tw`text-2xl py-2`}>Component Showcase</h2>
      <hr />
      <ComponentTitle module="/markdown.tsx">Markdown Summary</ComponentTitle>
      <Markdown summary context={{ url }}>
        {`Some _markdown_ with [links](https://deno.land/) and symbol links, like: {@linkcode Router}`}
      </Markdown>

      <ComponentTitle module="/module_index.tsx">ModuleIndex</ComponentTitle>
      <ModuleIndex
        url={new URL("https://deno.land/std@0.154.0")}
        sourceUrl="https://deno.land/std@0.154.0"
      >
        {moduleIndex.items}
      </ModuleIndex>

      <ComponentTitle module="/module_index_panel.tsx">
        ModuleIndexPanel
      </ComponentTitle>
      <ModuleIndexPanel
        base={new URL("https://deno.land/oak@v11.0.0")}
        path="/mod.ts"
        current="/mod.ts"
      >
        {moduleDoc.nav}
      </ModuleIndexPanel>

      <ComponentTitle module="/module_doc.tsx">ModuleDoc</ComponentTitle>
      <ModuleDoc url={url} sourceUrl={url.href}>
        {moduleDoc.docNodes}
      </ModuleDoc>

      <ComponentTitle module="/doc/symbol_doc.ts">SymbolDoc</ComponentTitle>
      <SymbolDoc url={url}>{symbolDoc.docNodes}</SymbolDoc>

      <ComponentTitle module="/doc/doc_common.tsx">Tag</ComponentTitle>
      {Object.values(tagVariants).map((tag) => tag())}

      <ComponentTitle module="/doc/usage.tsx">Usage</ComponentTitle>
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
  { docNodes, url }: { docNodes: DocNode[]; url: URL },
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
      <DocBlockClass context={{ url }}>{classNode}</DocBlockClass>
      <ComponentTitle module="/enum.tsx">DocBlockEnum</ComponentTitle>
      <DocBlockEnum context={{ url }}>{enumNode}</DocBlockEnum>
      <ComponentTitle module="/interfaces.tsx">
        DocBlockInterface
      </ComponentTitle>
      <DocBlockInterface context={{ url }}>
        {interfaceNode}
      </DocBlockInterface>
      <ComponentTitle module="/functions.tsx">DocBlockFn</ComponentTitle>
      <DocBlockFunction context={{ url }}>{fnNodes}</DocBlockFunction>
      <ComponentTitle module="/type_alias.tsx">DocNodeTypeAlias</ComponentTitle>
      <DocBlockTypeAlias context={{ url }}>
        {typeAliasNode}
      </DocBlockTypeAlias>
      <ComponentTitle module="/namespace.tsx">DocBlockNamespace</ComponentTitle>
      <DocBlockNamespace context={{ url }}>
        {namespaceNode}
      </DocBlockNamespace>
    </div>
  );
}
