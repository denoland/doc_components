// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { tw } from "../deps.ts";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, take } from "./utils.ts";
import * as Icons from "../icons.tsx";
import { docNodeKindMap } from "./symbol_kind.tsx";
import { byKindValue } from "./doc.ts";
import { tagVariants } from "./doc_common.tsx";
import { SymbolItem } from "./module_index_panel.tsx";

export function categorize(
  items: SymbolItem[],
): [categories: Record<string, SymbolItem[]>, uncategorized: SymbolItem[]] {
  const categories: Record<string, SymbolItem[]> = {};
  const uncategorized: SymbolItem[] = [];

  for (const item of items) {
    const category = item.category?.trim();
    if (category) {
      if (!(category in categories)) {
        categories[category] = [];
      }

      categories[category].push(item);
    } else {
      uncategorized.push(item);
    }
  }

  return [categories, uncategorized];
}

function Symbol(
  { children, base, active, currentSymbol, uncategorized }: {
    children: Child<SymbolItem>;
    base: URL;
    active: boolean;
    currentSymbol?: string;
    uncategorized?: boolean;
  },
) {
  const symbol = take(children);

  const isUnstable = symbol.jsDoc?.tags?.some((tag) =>
    tag.kind === "tags" && tag.tags.includes("unstable")
  );

  const Icon = docNodeKindMap[symbol.kind];
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
        <Icon />
        <span>{symbol.name}</span>
      </span>
      {isUnstable && tagVariants.unstable()}
    </a>
  );
}

function Category(
  { children, base, name, currentSymbol }: {
    children: Child<SymbolItem[]>;
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

      {items.filter((symbol) =>
        symbol.kind !== "import" && symbol.kind !== "moduleDoc"
      ).sort((a, b) =>
        byKindValue(a.kind, b.kind) || a.name.localeCompare(b.name)
      ).map((symbol) => (
        <Symbol base={base} active={active} currentSymbol={currentSymbol}>
          {symbol}
        </Symbol>
      ))}
    </details>
  );
}

export function LibraryIndexPanel(
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
  for (
    const symbol of uncategorized.filter((symbol) =>
      symbol.kind !== "import" && symbol.kind !== "moduleDoc"
    ).sort((a, b) =>
      byKindValue(a.kind, b.kind) || a.name.localeCompare(b.name)
    )
  ) {
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
