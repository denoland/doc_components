// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

import { type ComponentChildren, type DocNode } from "../deps.ts";
import { Examples, SectionTitle, tagVariants } from "./doc_common.tsx";
import * as Icons from "../icons.tsx";
import { type Context, JsDoc, Markdown } from "./markdown.tsx";
import { services } from "../services.ts";
import { style } from "../styles.ts";
import { Usage } from "./usage.tsx";
import * as SymbolKind from "./symbol_kind.tsx";
import {
  asCollection,
  byName,
  type Child,
  DocNodeCollection,
  DocNodeTupleArray,
  isAbstract,
  isDeprecated,
  maybe,
  take,
} from "./utils.ts";

function Entry<Node extends DocNode>(
  { children, icon, context }: {
    children: Child<[label: string, node: Node]>;
    icon: ComponentChildren;
    context: Context;
  },
) {
  const [label, node] = take(children, true);
  const name = context.namespace ? `${context.namespace}.${label}` : label;
  const href = services.resolveHref(context.url, name);

  return (
    <tr class={style("symbolListRow")}>
      <td class={style("symbolListCellSymbol")}>
        <div>
          {icon}
          <a href={href}>{name}</a>
          {maybe(isAbstract(node), tagVariants.abstract())}
          {maybe(isDeprecated(node), tagVariants.deprecated())}
        </div>
      </td>
      <td class={style("symbolListCellDoc")}>
        <Markdown summary context={context}>
          {node.jsDoc?.doc}
        </Markdown>
      </td>
    </tr>
  );
}

function Section<Node extends DocNode>(
  { children, title, icon, context }: {
    children: Child<DocNodeTupleArray<Node>>;
    title: string;
    icon: ComponentChildren;
    context: Context;
  },
) {
  const tuples = take(children, true, true);
  const displayed = new Set();
  const items = tuples.sort(byName).map(([label, node]) => {
    if (displayed.has(label)) {
      return null;
    }
    displayed.add(label);
    return (
      <Entry context={context} icon={icon}>
        {[label, node]}
      </Entry>
    );
  });
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <table class={style("symbolListTable")}>{items}</table>
    </div>
  );
}

export function DocTypeSections(
  { children, context }: {
    children: Child<DocNodeCollection>;
    context: Context;
  },
) {
  const collection = take(children);
  return (
    <>
      {collection.namespace && (
        <Section
          title="Namespaces"
          icon={<SymbolKind.Namespace />}
          context={context}
        >
          {collection.namespace}
        </Section>
      )}
      {collection.class && (
        <Section
          title="Classes"
          icon={<SymbolKind.Class />}
          context={context}
        >
          {collection.class}
        </Section>
      )}
      {collection.enum && (
        <Section
          title="Enums"
          icon={<SymbolKind.Enum />}
          context={context}
        >
          {collection.enum}
        </Section>
      )}
      {collection.variable && (
        <Section
          title="Variables"
          icon={<SymbolKind.Variable />}
          context={context}
        >
          {collection.variable}
        </Section>
      )}
      {collection.function && (
        <Section
          title="Functions"
          icon={<SymbolKind.Function />}
          context={context}
        >
          {collection.function}
        </Section>
      )}
      {collection.interface && (
        <Section
          title="Interfaces"
          icon={<SymbolKind.Interface />}
          context={context}
        >
          {collection.interface}
        </Section>
      )}
      {collection.typeAlias && (
        <Section
          title="Type Aliases"
          icon={<SymbolKind.TypeAlias />}
          context={context}
        >
          {collection.typeAlias}
        </Section>
      )}
    </>
  );
}

export function ModuleDoc(
  { children, sourceUrl, ...context }: {
    children: Child<DocNode[]>;
    sourceUrl: string;
  } & Pick<Context, "url" | "replacers">,
) {
  const docNodes = take(children, true);
  const isEmpty = docNodes.length === 0;
  const hasExports = docNodes.some(({ declarationKind, kind }) =>
    kind !== "moduleDoc" && declarationKind === "export"
  );
  const collection = asCollection(docNodes);
  const jsDoc = collection.moduleDoc?.[0][1].jsDoc;

  return (
    <div>
      <div class={style("moduleDocHeader")}>
        <div>{/* TODO: add module name */}</div>
        <a
          href={services.resolveSourceHref(sourceUrl)}
          class="icon-button"
          title="View Source"
        >
          <Icons.Source />
        </a>
      </div>
      <article class={style("main")}>
        <div class={style("moduleDoc")}>
          <div class="space-y-3">
            {isEmpty || hasExports ? <Usage url={context.url} /> : undefined}

            <JsDoc context={context}>{jsDoc}</JsDoc>
            <Examples context={context}>{jsDoc}</Examples>
          </div>
          {isEmpty
            ? (
              <div class="mx-8 p-4 border border-yellow-700 bg-yellow-50 text-yellow-700 rounded-lg text-center italic">
                The documentation for this module is currently unavailable.
              </div>
            )
            : hasExports
            ? (
              <DocTypeSections context={context}>
                {collection}
              </DocTypeSections>
            )
            : (
              <div class="mx-8 p-4 border border-blue-700 bg-blue-50 text-blue-700 rounded-lg text-center italic">
                This module does not provide any exports.
              </div>
            )}
        </div>
      </article>
    </div>
  );
}
