// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNode, tw } from "./deps.ts";
import {
  getDocSummary,
  IndexStructure,
  isAbstract,
  isDeprecated,
} from "./doc.ts";
import { Tag } from "./jsdoc.tsx";
import { MarkdownSummary } from "./markdown.tsx";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { type Child, maybe, take } from "./utils.ts";

function getModuleSummary(
  mod: string,
  entries: Map<string, DocNode[]>,
): string | undefined {
  const docNodes = entries.get(mod);
  if (docNodes) {
    for (const docNode of docNodes) {
      if (docNode.kind === "moduleDoc") {
        return getDocSummary(docNode);
      }
    }
  }
}

function ExportedSymbol(
  { children, name, path, base, summary }: {
    children: Child<DocNode>;
    name: string;
    path: string;
    base: string;
    summary?: string;
  },
) {
  const node = take(children);
  const href = services.href(path, name);
  let linkClass;
  switch (node.kind) {
    case "class":
      linkClass = style("symbolClass");
      break;
    case "enum":
      linkClass = style("symbolEnum");
      break;
    case "function":
      linkClass = style("symbolFunction");
      break;
    case "interface":
      linkClass = style("symbolInterface");
      break;
    case "typeAlias":
      linkClass = style("symbolTypeAlias");
      break;
    case "variable":
      linkClass = style("symbolVariable");
      break;
    case "namespace":
      linkClass = style("symbolNamespace");
      break;
    default:
      linkClass = tw`hover:underline`;
  }
  const url = `${base}${path}`;
  return (
    <tr>
      <td class={style("tdIndex")}>
        <a href={href} class={linkClass}>{name}</a>
        {maybe(isAbstract(node), <Tag color="yellow">abstract</Tag>)}
        {maybe(isDeprecated(node), <Tag color="gray">deprecated</Tag>)}
      </td>
      <td class={style("tdIndex")}>
        <MarkdownSummary url={url}>{summary}</MarkdownSummary>
      </td>
    </tr>
  );
}

function ModuleEntry(
  { children, name, base }: {
    children: Child<DocNode[]>;
    name: string;
    base: string;
  },
) {
  const entries = take(children, true);
  const nodeMap = new Map<string, { node: DocNode; summary?: string }>();
  let modSummary;
  for (const node of entries) {
    if (node.declarationKind === "export") {
      if (node.kind === "moduleDoc") {
        modSummary = getDocSummary(node);
      } else {
        const prev = nodeMap.get(node.name);
        if (prev) {
          if (!prev.summary) {
            prev.summary = getDocSummary(node);
          }
        } else {
          nodeMap.set(node.name, { node, summary: getDocSummary(node) });
        }
      }
    }
  }
  const items = Array.from(nodeMap).map(([name, { node, summary }]) => ({
    name,
    node,
    summary,
  }));
  items.sort((a, b) => a.name.localeCompare(b.name));
  const href = services.href(name);
  const path = name;
  const url = `${base}${path}`;
  const exports = items.map(({ name, node, summary }) => (
    <ExportedSymbol name={name} base={base} path={path} summary={summary}>
      {node}
    </ExportedSymbol>
  ));
  return (
    <>
      <tr>
        <td colSpan={2} class={tw`py-2`}>
          <a href={href} class={style("linkPadRight")}>{name}</a>
          <MarkdownSummary url={url}>{modSummary}</MarkdownSummary>
        </td>
      </tr>
      {exports}
    </>
  );
}

function ModuleList(
  { children, entries, base }: {
    children: Child<string[]>;
    entries: Map<string, DocNode[]>;
    base: string;
  },
) {
  const mods = take(children, true);
  const items = [];
  for (const mod of mods) {
    const nodes = entries.get(mod);
    if (nodes && nodes.length) {
      items.push(<ModuleEntry base={base} name={mod}>{nodes}</ModuleEntry>);
    }
  }
  return (
    <table class={tw`m-4`}>
      <tbody>{items}</tbody>
    </table>
  );
}

function Folder(
  { children, current, path, base, entries, expanded = false }: {
    children: Child<string[]>;
    current: boolean;
    path: string;
    base: string;
    entries: Map<string, DocNode[]>;
    expanded?: boolean;
  },
) {
  const mods = take(children, true);
  const summary = mods.length === 1
    ? getModuleSummary(mods[0], entries)
    : undefined;
  const id = path.slice(1).replaceAll(/[\s/]/g, "_") || "_root";
  const href = services.href(path);
  const url = `${base}${path}`;
  return (
    <div class={style("panel")} id={`group_${id}`}>
      {maybe(
        expanded,
        <input
          type="checkbox"
          id={`id_${id}`}
          class={tw`hidden`}
          aria-expanded={expanded}
          aria-controls={`group_${id}`}
        />,
        <input
          type="checkbox"
          id={`id_${id}`}
          checked
          class={tw`hidden`}
          aria-expanded={expanded}
          aria-controls={`group_${id}`}
        />,
      )}
      <label for={`id_${id}`} class={style("panelTitle")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          fill="#currentColor"
          class={style("rightArrow")}
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M10 17l5-5-5-5v10z" />
        </svg>
        <span class={tw`mr-4`}>
          {current ? path : <a href={href} class={style("link")}>{path}</a>}
        </span>
        <MarkdownSummary url={url}>{summary}</MarkdownSummary>
      </label>
      <ModuleList entries={entries} base={base}>{mods}</ModuleList>
    </div>
  );
}

/** Renders an index of a module, providing an overview of each module grouped
 * by path. */
export function ModuleIndex(
  { children, path = "/", base }: {
    children: Child<IndexStructure>;
    path?: string;
    base: string;
  },
) {
  const indexStructure = take(children);
  const folders: [string, string[]][] = [];
  for (const [key, value] of indexStructure.structure.entries()) {
    if (path === "/" || key.startsWith(path)) {
      folders.push([key, value]);
    }
  }
  const items = folders.map(([key, value]) => (
    <Folder
      path={key}
      base={base}
      expanded={folders.length <= 1}
      current={path === (key || "/")}
      entries={indexStructure.entries}
    >
      {value}
    </Folder>
  ));
  return <article class={style("main")}>{items}</article>;
}
