// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { DocNodeKind, JsDoc } from "../deps.ts";
import { byKindValue, getIndex } from "./doc.ts";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, take } from "./utils.ts";
import * as Icons from "../icons.tsx";
import { docNodeKindMap } from "./symbol_kind.tsx";

interface DocPageDirItem {
  kind: "dir";
  path: string;
}

export interface SymbolItem {
  name: string;
  kind: DocNodeKind;
  category?: string;
  jsDoc?: JsDoc | null;
}

interface DocPageModuleItem {
  kind: "module";
  path: string;
  items: SymbolItem[];
}

export type DocPageNavItem = DocPageModuleItem | DocPageDirItem;

export function splitItems(
  rootPath: string,
  items: DocPageNavItem[],
): [folders: DocPageDirItem[], modules: DocPageModuleItem[]] {
  const folders: DocPageDirItem[] = [];
  const modules: DocPageModuleItem[] = [];
  for (const item of items) {
    if (item.kind === "dir") {
      folders.push(item);
    } else {
      modules.push(item);
    }
  }
  return [folders, modules];
}

function Folder({ children, base, parent }: {
  children: Child<string>;
  base: URL;
  parent: string;
}) {
  const folderName = take(children);
  const url = new URL(base);
  url.pathname += folderName;
  const href = services.resolveHref(url);
  const label = folderName.slice(parent === "/" ? 1 : parent.length + 1);
  return (
    <a class={style("moduleIndexPanelEntry")} href={href} title={label}>
      <Icons.Dir />
      {label}
    </a>
  );
}

function Module(
  { children, base, parent, current, currentSymbol, isIndex }: {
    children: Child<DocPageModuleItem>;
    base: URL;
    parent: string;
    current?: string;
    currentSymbol?: string;
    isIndex?: boolean;
  },
) {
  const { path, items } = take(children);
  const url = new URL(base);
  url.pathname += path;
  const href = services.resolveHref(url);
  const label = path.slice(parent === "/" ? 1 : parent.length + 1);
  const active = current ? current == path : isIndex;
  return (
    <details
      open={!!(active && currentSymbol)}
      class={style("moduleIndexPanelDetails")}
    >
      <summary
        class={style("moduleIndexPanelEntry") +
          ((active && !currentSymbol)
            ? " " + style("moduleIndexPanelActive")
            : "")}
        title={label}
      >
        <Icons.TriangleRight
          tabindex={0}
          onKeyDown="if (event.code === 'Space' || event.code === 'Enter') { this.parentElement.click(); event.preventDefault(); }"
        />
        <a href={href}>
          {label}
          {isIndex && (
            <span class={style("moduleIndexPanelModuleIndex")}>
              {" "}(default module)
            </span>
          )}
        </a>
      </summary>

      {items.filter((symbol) =>
        symbol.kind !== "import" && symbol.kind !== "moduleDoc"
      ).sort((a, b) =>
        byKindValue(a.kind, b.kind) || a.name.localeCompare(b.name)
      ).map((symbol) => {
        const Icon = docNodeKindMap[symbol.kind];
        return (
          <a
            class={style("moduleIndexPanelSymbol") +
              ((active && currentSymbol === symbol.name)
                ? " " + style("moduleIndexPanelActive")
                : "")}
            href={services.resolveHref(url, symbol.name)}
            title={symbol.name}
          >
            <span>
              <Icon />
              <span>{symbol.name}</span>
            </span>
          </a>
        );
      })}
    </details>
  );
}

export function ModuleIndexPanel(
  { children, path = "/", base, current, currentSymbol }: {
    children: Child<DocPageNavItem[]>;
    base: URL;
    path: string;
    current?: string;
    currentSymbol?: string;
  },
) {
  const items = take(children, true);
  const [folders, modules] = splitItems(path, items);
  const entries = folders.sort().map((folder) => (
    <Folder base={base} parent={path}>
      {folder.path}
    </Folder>
  ));

  const moduleIndex = getIndex(modules.map((module) => module.path));
  if (moduleIndex) {
    if (current === path) {
      current = moduleIndex;
    }
    entries.push(
      <Module
        base={base}
        parent={path}
        current={current}
        currentSymbol={currentSymbol}
        isIndex
      >
        {modules.find((module) => module.path === moduleIndex)!}
      </Module>,
    );
  }
  modules.sort();
  for (const module of modules) {
    if (module.path !== moduleIndex) {
      entries.push(
        <Module
          base={base}
          parent={path}
          current={current}
          currentSymbol={currentSymbol}
        >
          {module}
        </Module>,
      );
    }
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
