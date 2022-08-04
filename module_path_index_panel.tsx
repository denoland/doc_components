// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { DocNode, DocNodeKind, JsDoc, tw } from "./deps.ts";
import { getIndex } from "./doc.ts";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { type Child, take } from "./utils.ts";
import * as Icons from "./icons.tsx";
import { docNodeKindMap, docNodeKindOrder } from "./symbol_kind.tsx";

interface DocPageDirItem {
  kind: "dir";
  path: string;
}

interface SymbolItem {
  name: string;
  kind: DocNodeKind;
  jsDoc?: JsDoc;
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
  base: string;
  parent: string;
}) {
  const folderName = take(children);
  const url = `${base}${folderName}`;
  const href = services.resolveHref(url);
  const label = `${folderName.slice(parent === "/" ? 1 : parent.length + 1)}/`;
  return (
    <a class={style("modulePathIndexPanelEntry")} href={href}>
      <Icons.Dir />
      {label}
    </a>
  );
}

function Module(
  { children, base, parent, current, currentSymbol, isIndex }: {
    children: Child<DocPageModuleItem>;
    base: string;
    parent: string;
    current?: string;
    currentSymbol?: string;
    isIndex?: boolean;
  },
) {
  const { path, items } = take(children);
  const url = `${base}${path}`;
  const href = services.resolveHref(url);
  const label = path.slice(parent === "/" ? 1 : parent.length + 1);
  const active = current ? current == path : isIndex;
  return (
    <div>
      <input
        type="checkbox"
        id={path}
        class={style("modulePathIndexPanelToggle")}
        autoComplete="off"
        checked={!!(active && currentSymbol)}
      />
      <a
        class={style("modulePathIndexPanelEntry") +
          ((active && !currentSymbol)
            ? " " + style("modulePathIndexPanelActive")
            : "")}
        href={href}
      >
        <label htmlFor={path}>
          <Icons.TriangleLeft />
        </label>
        <span>
          {label}
          {isIndex && (
            <span class={style("modulePathIndexPanelModuleIndex")}>
              {" "}(default module)
            </span>
          )}
        </span>
      </a>

      <div>
        {items.filter((symbol) =>
          symbol.kind !== "import" && symbol.kind !== "moduleDoc"
        ).sort((a, b) =>
          (docNodeKindOrder.indexOf(a.kind) -
            docNodeKindOrder.indexOf(b.kind)) || a.name.localeCompare(b.name)
        ).map((symbol) => {
          const Icon = docNodeKindMap[symbol.kind];
          return (
            <a
              class={style("modulePathIndexPanelSymbol") +
                ((active && currentSymbol === symbol.name)
                  ? " " + style("modulePathIndexPanelActive")
                  : "")}
              href={services.resolveHref(url, symbol.name)}
            >
              <Icon />
              {symbol.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function ModulePathIndexPanel(
  { children, path = "/", base, current, currentSymbol }: {
    children: Child<DocPageNavItem[]>;
    base: string;
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
    <div class={style("modulePathIndexPanel")}>
      {
        /*<input
        type="text"
        class={tw
          `rounded-lg border border-[#DDDDDD] text-sm w-full py-2.5 pl-4`}
        placeholder="Jump to..."
      />
      <div class={tw`mt-4`}>
      </div>*/
      }
      {entries}
    </div>
  );
}
