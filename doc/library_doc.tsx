// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { tw } from "../deps.ts";
import { byKindValue, getDocSummary } from "./doc.ts";
import { SectionTitle, tagVariants } from "./doc_common.tsx";
import * as Icons from "../icons.tsx";
import { type MarkdownContext, MarkdownSummary } from "./markdown.tsx";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, isDeprecated, take } from "./utils.ts";
import { docNodeKindMap } from "./symbol_kind.tsx";
import { categorize } from "./library_doc_panel.tsx";
import { type SymbolItem } from "./module_index_panel.tsx";
import { JsDoc } from "./jsdoc.tsx";

function Entry(
  { children, markdownContext }: {
    children: Child<SymbolItem>;
    markdownContext: MarkdownContext;
  },
) {
  const item = take(children);
  const href = services.resolveHref(markdownContext.url, item.name);
  const isUnstable = item.jsDoc?.tags?.some((tag) =>
    tag.kind === "tags" && tag.tags.includes("unstable")
  );

  return (
    <tr class={style("symbolListRow")}>
      <td class={style("symbolListCellSymbol")}>
        <div>
          {docNodeKindMap[item.kind]()}
          <a href={href}>{item.name}</a>
          <span class={tw`space-x-1`}>
            {isDeprecated({ jsDoc: item.jsDoc ?? undefined }) &&
              tagVariants.deprecated()}
            {isUnstable && tagVariants.unstable()}
          </span>
        </div>
      </td>
      <td class={style("symbolListCellDoc")}>
        <MarkdownSummary markdownContext={markdownContext}>
          {getDocSummary(item.jsDoc ?? undefined)}
        </MarkdownSummary>
      </td>
    </tr>
  );
}

function Section(
  { children, title, markdownContext }: {
    children: Child<SymbolItem[]>;
    title: string;
    markdownContext: MarkdownContext;
  },
) {
  const symbols = take(children, true);

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <table class={style("symbolListTable")}>
        {symbols.sort((a, b) =>
          byKindValue(a.kind, b.kind) || a.name.localeCompare(b.name)
        ).map((symbol) => (
          <Entry markdownContext={markdownContext}>
            {symbol}
          </Entry>
        ))}
      </table>
    </div>
  );
}

export function LibraryDoc(
  { children, sourceUrl, jsDoc, ...markdownContext }: {
    children: Child<SymbolItem[]>;
    jsDoc?: string;
    sourceUrl: string;
  } & Pick<MarkdownContext, "url" | "replacers">,
) {
  const items = take(children, true);

  const [categories, uncategorized] = categorize(items);

  return (
    <div>
      <div class={style("moduleDocHeader")}>
        <div />
        <a
          href={services.resolveSourceHref(sourceUrl)}
          class={tw`icon-button`}
        >
          <Icons.Source />
        </a>
      </div>
      <article class={style("main")}>
        <div class={style("moduleDoc")}>
          {jsDoc && (
            <JsDoc markdownContext={markdownContext}>{{ doc: jsDoc }}</JsDoc>
          )}

          {Object.entries(categories).sort(([a], [b]) => a.localeCompare(b))
            .map(([category, items]) => (
              <Section title={category} markdownContext={markdownContext}>
                {items}
              </Section>
            ))}
          {uncategorized.length !== 0 && (
            <Section title="Uncategorized" markdownContext={markdownContext}>
              {uncategorized}
            </Section>
          )}
        </div>
      </article>
    </div>
  );
}
