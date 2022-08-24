// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeNamespace } from "../deps.ts";
import { type MarkdownContext } from "./markdown.tsx";
import { Section } from "./module_doc.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import * as SymbolKind from "./symbol_kind.tsx";
import { asCollection, Child, take } from "./utils.ts";

export function DocBlockNamespace(
  { children, namespace: parentNamespace, ...markdownContext }:
    & { children: Child<DocNodeNamespace> }
    & MarkdownContext,
) {
  const { name, namespaceDef: { elements } } = take(children);
  const namespace = parentNamespace ? `${parentNamespace}.${name}` : name;
  const collection = asCollection(elements);
  const context = { namespace, ...markdownContext };
  return (
    <div class={style("docBlockItems")}>
      {collection.namespace && (
        <Section
          title="Namespaces"
          icon={<SymbolKind.Namespace />}
          {...context}
        >
          {collection.namespace}
        </Section>
      )}
      {collection.class && (
        <Section title="Classes" icon={<SymbolKind.Class />} {...context}>
          {collection.class}
        </Section>
      )}
      {collection.enum && (
        <Section title="Enums" icon={<SymbolKind.Enum />} {...context}>
          {collection.enum}
        </Section>
      )}
      {collection.variable && (
        <Section title="Variables" icon={<SymbolKind.Variable />} {...context}>
          {collection.variable}
        </Section>
      )}
      {collection.function && (
        <Section title="Functions" icon={<SymbolKind.Function />} {...context}>
          {collection.function}
        </Section>
      )}
      {collection.interface && (
        <Section
          title="Interfaces"
          icon={<SymbolKind.Interface />}
          {...context}
        >
          {collection.interface}
        </Section>
      )}
      {collection.typeAlias && (
        <Section
          title="Type Aliases"
          icon={<SymbolKind.TypeAlias />}
          {...context}
        >
          {collection.typeAlias}
        </Section>
      )}
    </div>
  );
}
