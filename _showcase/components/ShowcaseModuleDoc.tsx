import { apply, tw } from "twind";
import { css } from "twind/css";
import { type DocNode } from "@doc_components/deps.ts";

import { ModuleDoc } from "@doc_components/doc/module_doc.tsx";

import { ComponentLink } from "./ComponentLink.tsx";
import { ComponentTitle } from "./ComponentTitle.tsx";

const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

export function ShowcaseModuleDoc({ url }: { url: URL }) {
  const noExportsDocNodes: DocNode[] = [{
    kind: "import",
    declarationKind: "private",
    importDef: { src: "https://deno.land/x/std/testing/asserts.ts" },
    name: "assert",
    location: {
      filename: "https://deno.land/x/oak@v11.1.0/mod.ts",
      col: 12,
      line: 1,
    },
  }];
  return (
    <div
      class={tw`bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 p-4`}
    >
      <h1 class="text-3xl py-3">Deno Doc Components</h1>
      <h2 class="text-2xl py-2 border-b-1">DocBlock Component Showcase</h2>
      <nav class="py-4 border-b-1">
        <h3 class="text-xl">Component List</h3>
        <ul class="list-disc mx-6 my-2">
          <ComponentLink>ModuleDoc - Empty</ComponentLink>
          <ComponentLink>ModuleDoc - No Exports</ComponentLink>
        </ul>
      </nav>

      <ComponentTitle module="/doc/module_doc.tsx">
        ModuleDoc - Empty
      </ComponentTitle>
      <ModuleDoc url={url} sourceUrl={url.href}>{[]}</ModuleDoc>

      <ComponentTitle module="/doc/module_doc.tsx">
        ModuleDoc - No Exports
      </ComponentTitle>
      <ModuleDoc url={url} sourceUrl={url.href}>{noExportsDocNodes}</ModuleDoc>
    </div>
  );
}
