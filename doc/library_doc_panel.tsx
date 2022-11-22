// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNodeKind, type JsDoc, tw } from "../deps.ts";
import { services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, take } from "./utils.ts";
import * as Icons from "../icons.tsx";
import { docNodeKindMap } from "./symbol_kind.tsx";
import { byKindValue } from "./doc.ts";
import { tagVariants } from "./doc_common.tsx";
import { SymbolItem } from "./module_index_panel.tsx";

export interface ProcessedSymbol {
  name: string;
  kinds: DocNodeKind[];
  unstable: boolean;
  category?: string;
  jsDoc?: JsDoc | null;
}

export function categorize(
  items: SymbolItem[],
): [
  categories: Record<string, ProcessedSymbol[]>,
  uncategorized: ProcessedSymbol[],
] {
  const symbols: ProcessedSymbol[] = [];
  for (
    const symbolItem of items.filter((symbol) =>
      symbol.kind !== "import" && symbol.kind !== "moduleDoc"
    ).sort((a, b) =>
      byKindValue(a.kind, b.kind) || a.name.localeCompare(b.name)
    )
  ) {
    const existing = symbols.find((symbol) => symbol.name === symbolItem.name);
    const isUnstable = symbolItem.jsDoc?.tags?.some((tag) =>
      tag.kind === "tags" && tag.tags.includes("unstable")
    ) ?? false;
    if (!existing) {
      symbols.push({
        name: symbolItem.name,
        kinds: [symbolItem.kind],
        unstable: isUnstable,
        category: symbolItem.category?.trim(),
        jsDoc: symbolItem.jsDoc,
      });
    } else {
      existing.kinds.push(symbolItem.kind);
      if (!existing.unstable && isUnstable) {
        existing.unstable = true;
      }
      if (!existing.jsDoc && symbolItem.jsDoc) {
        existing.jsDoc = symbolItem.jsDoc;
      }
    }
  }

  const categories: Record<string, ProcessedSymbol[]> = {};
  const uncategorized: ProcessedSymbol[] = [];

  for (const item of symbols) {
    if (item.category) {
      if (!(item.category in categories)) {
        categories[item.category] = [];
      }

      categories[item.category].push(item);
    } else {
      uncategorized.push(item);
    }
  }

  return [categories, uncategorized];
}

function Symbol(
  { children, base, active, currentSymbol, uncategorized }: {
    children: Child<ProcessedSymbol>;
    base: URL;
    active: boolean;
    currentSymbol?: string;
    uncategorized?: boolean;
  },
) {
  const symbol = take(children);

  return (
    <a
      class={`${style("moduleIndexPanelSymbol")} ${
        uncategorized ? tw`pl-3` : ""
      } ${
        (active && currentSymbol === symbol.name)
          ? style("moduleIndexPanelActive")
          : ""
      }`}
      href={services.resolveHref(base, symbol.name)}
      title={symbol.name}
    >
      <span>
        <div class={tw`${style("symbolKindDisplay")} justify-end`}>
          {symbol.kinds.map((kind) => docNodeKindMap[kind]())}
        </div>
        <span>{symbol.name}</span>
      </span>
      {symbol.unstable && tagVariants.unstable()}
    </a>
  );
}

function Category(
  { children, base, name, currentSymbol }: {
    children: Child<ProcessedSymbol[]>;
    name: string;
    base: URL;
    currentSymbol?: string;
  },
) {
  const items = take(children, true);
  const active = !!items.find(({ name }) => name === currentSymbol);
  return (
    <details
      open={active}
      class={style("moduleIndexPanelDetails")}
    >
      <summary
        class={style("moduleIndexPanelEntry")}
        title={name}
      >
        <Icons.TriangleRight
          tabindex={0}
          onKeyDown="if (event.code === 'Space' || event.code === 'Enter') { this.parentElement.click(); event.preventDefault(); }"
        />
        <span>
          {name}
        </span>
      </summary>

      {items.sort((a, b) =>
        byKindValue(a.kinds[0], b.kinds[0]) || a.name.localeCompare(b.name)
      ).map((symbol) => (
        <Symbol base={base} active={active} currentSymbol={currentSymbol}>
          {symbol}
        </Symbol>
      ))}
    </details>
  );
}

export function LibraryDocPanel(
  { children, base, currentSymbol }: {
    children: Child<SymbolItem[]>;
    base: URL;
    currentSymbol?: string;
  },
) {
  const items = take(children, true);

  const [categories, uncategorized] = categorize(items);

  const entries = [];
  for (
    const [name, symbols] of Object.entries(categories).sort(([a], [b]) =>
      a.localeCompare(b)
    )
  ) {
    entries.push(
      <Category
        name={name}
        base={base}
        currentSymbol={currentSymbol}
      >
        {symbols}
      </Category>,
    );
  }

  const uncategorizedActive = !!uncategorized.find(({ name }) =>
    name === currentSymbol
  );
  for (const symbol of uncategorized) {
    entries.push(
      <Symbol
        base={base}
        active={uncategorizedActive}
        currentSymbol={currentSymbol}
        uncategorized
      >
        {symbol}
      </Symbol>,
    );
  }

  if (entries.length === 0) {
    return <></>;
  }
  return (
    <div class={style("moduleIndexPanel")}>
      {entries}
    </div>
  );
}
