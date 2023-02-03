// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

import { SectionTitle, tagVariants } from "./doc_common.tsx";
import * as Icons from "../icons.tsx";
import { type Context, JsDoc, Markdown } from "./markdown.tsx";
import { services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, isDeprecated, take } from "./utils.ts";
import { docNodeKindMap } from "./symbol_kind.tsx";
import { categorize, type ProcessedSymbol } from "./library_doc_panel.tsx";
import { type SymbolItem } from "./module_index_panel.tsx";

function Entry(
  { children, context }: {
    children: Child<ProcessedSymbol>;
    context: Context;
  },
) {
  const item = take(children);
  const href = services.resolveHref(context.url, item.name);

  return (
    <tr class={style("symbolListRow")}>
      <td class={style("symbolListCellSymbol")}>
        <div>
          <div class={`${style("symbolKindDisplay")} justify-center`}>
            {item.kinds.map((kind) => docNodeKindMap[kind]())}
          </div>
          <a href={href}>{item.name}</a>
          <span class="space-x-1">
            {isDeprecated({ jsDoc: item.jsDoc ?? undefined }) &&
              tagVariants.deprecated()}
            {item.unstable && tagVariants.unstable()}
          </span>
        </div>
      </td>
      <td class={style("symbolListCellDoc")}>
        <Markdown summary context={context}>
          {item.jsDoc?.doc}
        </Markdown>
      </td>
    </tr>
  );
}

function Section(
  { children, title, context }: {
    children: Child<ProcessedSymbol[]>;
    title: string;
    context: Context;
  },
) {
  const symbols = take(children, true);

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <table class={style("symbolListTable")}>
        {symbols.map((symbol) => (
          <Entry context={context}>
            {symbol}
          </Entry>
        ))}
      </table>
    </div>
  );
}

export function LibraryDoc(
  { children, sourceUrl, jsDoc, ...context }: {
    children: Child<SymbolItem[]>;
    jsDoc?: string;
    sourceUrl: string;
  } & Pick<Context, "url" | "replacers">,
) {
  const items = take(children, true);

  const [categories, uncategorized] = categorize(items);

  return (
    <div>
      <div class={style("moduleDocHeader")}>
        <div />
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
          {jsDoc && <JsDoc context={context}>{{ doc: jsDoc }}</JsDoc>}

          {Object.entries(categories).sort(([a], [b]) => a.localeCompare(b))
            .map(([category, items]) => (
              <Section title={category} context={context}>
                {items}
              </Section>
            ))}
          {uncategorized.length !== 0 && (
            <Section title="Uncategorized" context={context}>
              {uncategorized}
            </Section>
          )}
        </div>
      </article>
    </div>
  );
}
