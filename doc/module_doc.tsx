// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNode, tw } from "../deps.ts";
import { getDocSummary } from "./doc.ts";
import { SectionTitle, tagVariants } from "./doc_common.tsx";
import * as Icons from "../icons.tsx";
import { JsDocModule } from "./jsdoc.tsx";
import { type MarkdownContext, MarkdownSummary } from "./markdown.tsx";
import { runtime, services } from "../services.ts";
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
  { children, icon, markdownContext }: {
    children: Child<[label: string, node: Node]>;
    icon: ComponentChildren;
    markdownContext: MarkdownContext;
  },
) {
  const [label, node] = take(children, true);
  const href = services.resolveHref(
    markdownContext.url,
    markdownContext.namespace ? `${markdownContext.namespace}.${label}` : label,
  );

  return (
    <tr class={style("symbolListRow")}>
      <td class={style("symbolListCellSymbol")}>
        <div>
          {icon}
          <a href={href}>{label}</a>
          {maybe(isAbstract(node), tagVariants.abstract())}
          {maybe(isDeprecated(node), tagVariants.deprecated())}
        </div>
      </td>
      <td class={style("symbolListCellDoc")}>
        <MarkdownSummary markdownContext={markdownContext}>
          {getDocSummary(node)}
        </MarkdownSummary>
      </td>
    </tr>
  );
}

function Section<Node extends DocNode>(
  { children, title, icon, markdownContext }: {
    children: Child<DocNodeTupleArray<Node>>;
    title: string;
    icon: ComponentChildren;
    markdownContext: MarkdownContext;
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
      <Entry markdownContext={markdownContext} icon={icon}>
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
  { children, markdownContext }: {
    children: Child<DocNodeCollection>;
    markdownContext: MarkdownContext;
  },
) {
  const collection = take(children);
  return (
    <>
      {collection.namespace && (
        <Section
          title="Namespaces"
          icon={<SymbolKind.Namespace />}
          markdownContext={markdownContext}
        >
          {collection.namespace}
        </Section>
      )}
      {collection.class && (
        <Section
          title="Classes"
          icon={<SymbolKind.Class />}
          markdownContext={markdownContext}
        >
          {collection.class}
        </Section>
      )}
      {collection.enum && (
        <Section
          title="Enums"
          icon={<SymbolKind.Enum />}
          markdownContext={markdownContext}
        >
          {collection.enum}
        </Section>
      )}
      {collection.variable && (
        <Section
          title="Variables"
          icon={<SymbolKind.Variable />}
          markdownContext={markdownContext}
        >
          {collection.variable}
        </Section>
      )}
      {collection.function && (
        <Section
          title="Functions"
          icon={<SymbolKind.Function />}
          markdownContext={markdownContext}
        >
          {collection.function}
        </Section>
      )}
      {collection.interface && (
        <Section
          title="Interfaces"
          icon={<SymbolKind.Interface />}
          markdownContext={markdownContext}
        >
          {collection.interface}
        </Section>
      )}
      {collection.typeAlias && (
        <Section
          title="Type Aliases"
          icon={<SymbolKind.TypeAlias />}
          markdownContext={markdownContext}
        >
          {collection.typeAlias}
        </Section>
      )}
    </>
  );
}

export function ModuleDoc(
  { children, library = false, sourceUrl, markdownContext }: {
    children: Child<DocNode[]>;
    library?: boolean;
    sourceUrl: string;
    markdownContext: MarkdownContext;
  },
) {
  const collection = asCollection(take(children, true));
  return (
    <div>
      <div class={style("moduleDocHeader")}>
        <div>{/* TODO: add module name */}</div>
        <a
          href={services.resolveSourceHref(sourceUrl)}
          class={tw`icon-button`}
        >
          <Icons.Source />
        </a>
      </div>
      <article class={style("main")}>
        {maybe(
          !(library || markdownContext.url.endsWith(".d.ts")),
          <div class={style("moduleDoc")}>
            <div class={tw`space-y-3`}>
              <Usage url={markdownContext.url} />
              {collection.moduleDoc && (
                <JsDocModule markdownContext={markdownContext}>
                  {collection.moduleDoc}
                </JsDocModule>
              )}
            </div>
            <DocTypeSections markdownContext={markdownContext}>
              {collection}
            </DocTypeSections>
          </div>,
        )}
      </article>
    </div>
  );
}
