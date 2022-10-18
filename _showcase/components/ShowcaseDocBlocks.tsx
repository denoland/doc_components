import { apply, tw } from "twind";
import { css } from "twind/css";
import {
  type DocNode,
  type DocNodeClass,
  type DocNodeEnum,
  type DocNodeFunction,
  type DocNodeInterface,
  type DocNodeNamespace,
  type DocNodeTypeAlias,
} from "@doc_components/deps.ts";
import { DocBlockClass } from "@doc_components/doc/classes.tsx";
import { DocBlockEnum } from "@doc_components/doc/enums.tsx";
import { DocBlockFunction } from "@doc_components/doc/functions.tsx";
import { DocBlockInterface } from "@doc_components/doc/interfaces.tsx";
import { DocBlockNamespace } from "@doc_components/doc/namespaces.tsx";
import { DocBlockTypeAlias } from "@doc_components/doc/type_aliases.tsx";

import { ComponentLink } from "./ComponentLink.tsx";
import { ComponentTitle } from "./ComponentTitle.tsx";

const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

export function ShowcaseDocBlocks(
  { children: docNodes, url }: { children: DocNode[]; url: URL },
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
      class={tw`h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 p-4`}
    >
      <h1 class="text-3xl py-3">Deno Doc Components</h1>
      <h2 class="text-2xl py-2 border-b-1">DocBlock Component Showcase</h2>
      <nav class="py-4 border-b-1">
        <h3 class="text-xl">Component List</h3>
        <ul class="list-disc mx-6 my-2">
          <ComponentLink>DocBlockClass</ComponentLink>
          <ComponentLink>DocBlockEnum</ComponentLink>
          <ComponentLink>DocBlockInterface</ComponentLink>
          <ComponentLink>DocBlockFn</ComponentLink>
          <ComponentLink>DocNodeTypeAlias</ComponentLink>
          <ComponentLink>DocBlockNamespace</ComponentLink>
        </ul>
      </nav>

      <ComponentTitle module="/doc/classes.tsx">DocBlockClass</ComponentTitle>
      <DocBlockClass context={{ url }}>{classNode}</DocBlockClass>

      <ComponentTitle module="/doc/enum.tsx">DocBlockEnum</ComponentTitle>
      <DocBlockEnum context={{ url }}>{enumNode}</DocBlockEnum>

      <ComponentTitle module="/doc/interfaces.tsx">
        DocBlockInterface
      </ComponentTitle>
      <DocBlockInterface context={{ url }}>{interfaceNode}</DocBlockInterface>

      <ComponentTitle module="/doc/functions.tsx">DocBlockFn</ComponentTitle>
      <DocBlockFunction context={{ url }}>{fnNodes}</DocBlockFunction>

      <ComponentTitle module="/doc/type_alias.tsx">
        DocNodeTypeAlias
      </ComponentTitle>
      <DocBlockTypeAlias context={{ url }}>{typeAliasNode}</DocBlockTypeAlias>

      <ComponentTitle module="/doc/namespace.tsx">
        DocBlockNamespace
      </ComponentTitle>
      <DocBlockNamespace context={{ url }}>{namespaceNode}</DocBlockNamespace>
    </div>
  );
}
