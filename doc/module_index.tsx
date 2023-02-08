// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

import { type Context, Markdown } from "./markdown.tsx";
import { services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, take } from "./utils.ts";
import * as Icons from "../icons.tsx";

export interface IndexItem {
  kind: "dir" | "module" | "file";
  path: string;
  size: number;
  ignored: boolean;
  doc?: string;
}

function Folder({ children, parent, context }: {
  children: Child<IndexItem>;
  parent: string;
  context: Context;
}) {
  const item = take(children);
  const url = new URL(context.url);
  url.pathname += item.path;
  const href = services.resolveHref(url);
  const label = item.path.slice(parent === "/" ? 1 : parent.length + 1);
  return (
    <tr class={style("moduleIndexRow")}>
      <td class={style("moduleIndexLinkCell")}>
        <Icons.Dir class={style("moduleIndexLinkCellIcon")} />
        <a href={href} class="link">{label}</a>
      </td>
      <td class={style("moduleIndexDocCell")}>
        <Markdown summary context={{ ...context, url }}>
          {item.doc}
        </Markdown>
      </td>
    </tr>
  );
}

function Module({ children, parent, context }: {
  children: Child<IndexItem>;
  parent: string;
  context: Context;
}) {
  const item = take(children);
  const url = new URL(context.url);
  url.pathname += item.path;
  const href = services.resolveHref(url);
  const label = item.path.slice(parent === "/" ? 1 : parent.length + 1);
  return (
    <tr class={style("moduleIndexRow")}>
      <td class={style("moduleIndexLinkCell")}>
        <Icons.Source class={style("moduleIndexLinkCellIcon")} />
        <a href={href} class="link">{label}</a>
      </td>
      <td class={style("moduleIndexDocCell")}>
        <Markdown summary context={{ ...context, url }}>
          {item.doc}
        </Markdown>
      </td>
    </tr>
  );
}

const order = ["dir", "module", "file"] as const;

export function ModuleIndex(
  {
    children,
    path = "/",
    skipMods = false,
    sourceUrl,
    ...context
  }: {
    children: Child<IndexItem[]>;
    skipMods?: boolean;
    path?: string;
    sourceUrl: string;
  } & Pick<Context, "url" | "replacers">,
) {
  const items = take(children, true);
  items.sort((a, b) =>
    (order.indexOf(a.kind) - order.indexOf(b.kind)) ||
    a.path.localeCompare(b.path)
  );
  const entries = [];
  for (const item of items) {
    if (item.ignored) {
      continue;
    }
    if (item.kind === "dir") {
      entries.push(
        <Folder parent={path} context={context}>
          {item}
        </Folder>,
      );
    } else if (item.kind === "module" && !skipMods) {
      entries.push(
        <Module parent={path} context={context}>
          {item}
        </Module>,
      );
    }
  }

  if (entries.length === 0) {
    return <></>;
  }
  return (
    <div class={style("moduleIndex")}>
      <div class={style("moduleIndexHeader")}>
        <div class={style("moduleIndexHeaderTitle")}>
          <Icons.Index />
          <span class={style("moduleIndexHeaderTitleSpan")}>Index</span>
        </div>
        <a
          href={services.resolveSourceHref(sourceUrl)}
          class="icon-button"
          title="View Source"
        >
          <Icons.Source />
        </a>
      </div>
      <table class={style("moduleIndexTable")}>{entries}</table>
    </div>
  );
}
