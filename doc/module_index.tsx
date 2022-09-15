// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { getSummary, MarkdownContext, MarkdownSummary } from "./markdown.tsx";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, take } from "./utils.ts";
import * as Icons from "../icons.tsx";
import { tw } from "../deps.ts";

export interface IndexItem {
  kind: "dir" | "module" | "file";
  path: string;
  size: number;
  ignored: boolean;
  doc?: string;
}

function Folder({ children, parent, markdownContext }: {
  children: Child<IndexItem>;
  parent: string;
  markdownContext: MarkdownContext;
}) {
  const item = take(children);
  const url = new URL(markdownContext.url);
  url.pathname += item.path;
  const href = services.resolveHref(url);
  const summary = getSummary(item.doc);
  const label = item.path.slice(parent === "/" ? 1 : parent.length + 1);
  return (
    <tr class={style("moduleIndexRow")}>
      <td class={style("moduleIndexLinkCell")}>
        <Icons.Dir class={style("moduleIndexLinkCellIcon")} />
        <a href={href} class={style("link")}>{label}</a>
      </td>
      <td class={style("moduleIndexDocCell")}>
        <MarkdownSummary markdownContext={{ ...markdownContext, url }}>
          {summary}
        </MarkdownSummary>
      </td>
    </tr>
  );
}

function Module({ children, parent, markdownContext }: {
  children: Child<IndexItem>;
  parent: string;
  markdownContext: MarkdownContext;
}) {
  const item = take(children);
  const url = new URL(markdownContext.url);
  url.pathname += item.path;
  const href = services.resolveHref(url);
  const summary = getSummary(item.doc);
  const label = item.path.slice(parent === "/" ? 1 : parent.length + 1);
  return (
    <tr class={style("moduleIndexRow")}>
      <td class={style("moduleIndexLinkCell")}>
        <Icons.Source class={style("moduleIndexLinkCellIcon")} />
        <a href={href} class={style("link")}>{label}</a>
      </td>
      <td class={style("moduleIndexDocCell")}>
        <MarkdownSummary markdownContext={{ ...markdownContext, url }}>
          {summary}
        </MarkdownSummary>
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
    ...markdownContext
  }: {
    children: Child<IndexItem[]>;
    skipMods?: boolean;
    path?: string;
    sourceUrl: string;
  } & Pick<MarkdownContext, "url" | "replacers">,
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
        <Folder parent={path} markdownContext={markdownContext}>
          {item}
        </Folder>,
      );
    } else if (item.kind === "module" && !skipMods) {
      entries.push(
        <Module parent={path} markdownContext={markdownContext}>
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
          class={tw`icon-button`}
        >
          <Icons.Source />
        </a>
      </div>
      <table class={style("moduleIndexTable")}>{entries}</table>
    </div>
  );
}
