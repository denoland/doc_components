import type { DocPageIndex, DocPageModule, DocPageSymbol } from "apiland/types";
import { apply, tw } from "twind";
import { css } from "twind/css";

import { tagVariants } from "@doc_components/doc/doc_common.tsx";
import { Markdown } from "@doc_components/doc/markdown.tsx";
import { ModuleDoc } from "@doc_components/doc/module_doc.tsx";
import { ModuleIndex } from "@doc_components/doc/module_index.tsx";
import { SymbolDoc } from "@doc_components/doc/symbol_doc.tsx";
import { Usage } from "@doc_components/doc/usage.tsx";

import { ComponentLink } from "./ComponentLink.tsx";
import { ComponentTitle } from "./ComponentTitle.tsx";

const app = css({
  ":global": {
    "html": apply`bg-white dark:bg-gray-900`,
  },
});

export function Showcase(
  { url, modulePage, symbolPage, indexPage }: {
    url: URL;
    modulePage: DocPageModule;
    symbolPage: DocPageSymbol;
    indexPage: DocPageIndex;
  },
) {
  return (
    <div
      class={tw`bg-white dark:bg-gray-900 dark:text-white ${app} max-w-screen-xl mx-auto my-4 p-4`}
    >
      <h1 class="text-3xl py-3">Deno Doc Components</h1>
      <h2 class="text-2xl py-2 border-b-1">Component Showcase</h2>
      <nav class="py-4 border-b-1">
        <h3 class="text-xl">Component List</h3>
        <ul class="list-disc mx-6 my-2">
          <ComponentLink>Markdown Summary</ComponentLink>
          <ComponentLink>ModuleIndex</ComponentLink>
          <ComponentLink>ModuleDoc</ComponentLink>
          <ComponentLink>Tags</ComponentLink>
          <ComponentLink>Usage</ComponentLink>
        </ul>
        <h3 class="text-xl">Other Components</h3>
        <ul class="list-disc mx-6 my-2">
          <li>
            <a
              href="/docblocks"
              class="text-blue-800 dark:text-blue-300 hover:underline"
            >
              DocBlocks
            </a>
          </li>
        </ul>
      </nav>

      <ComponentTitle module="/doc/markdown.tsx">
        Markdown Summary
      </ComponentTitle>
      <Markdown summary context={{ url }}>
        {`Some _markdown_ with [links](https://deno.land/) and symbol links, like: {@linkcode Router}`}
      </Markdown>

      <ComponentTitle module="/doc/module_index.tsx">
        ModuleIndex
      </ComponentTitle>
      <ModuleIndex url={url} sourceUrl={url.href}>
        {indexPage.items}
      </ModuleIndex>

      <ComponentTitle module="/doc/module_doc.tsx">ModuleDoc</ComponentTitle>
      <ModuleDoc url={url} sourceUrl={url.href}>
        {modulePage.docNodes}
      </ModuleDoc>

      <ComponentTitle module="/doc/symbol_doc.tsx">SymbolDoc</ComponentTitle>
      <SymbolDoc url={url} name={symbolPage.name}>
        {symbolPage.docNodes}
      </SymbolDoc>

      <ComponentTitle module="/doc/doc_common.tsx">Tags</ComponentTitle>
      <div class="space-x-1">
        {Object.values(tagVariants).map((tag) => tag())}
      </div>

      <ComponentTitle module="/doc/usage.tsx">Usage</ComponentTitle>
      <div class="space-y-4">
        <Usage url={new URL("https://deno.land/x/example@v1.0.0/mod.ts")} />
        <Usage
          url={new URL("https://deno.land/x/example@v1.0.0/mod.ts")}
          name="MyClass"
        />
        <Usage
          url={new URL("https://deno.land/x/example@v1.0.0/mod.ts")}
          name="myNamespace.MyClass"
        />
        <Usage
          url={new URL("https://deno.land/x/example@v1.0.0/mod.ts")}
          name="Interface"
          isType
        />
      </div>
    </div>
  );
}
