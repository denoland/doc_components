// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

import {
  type Accessibility,
  type ComponentChildren,
  type JsDoc as JsDocType,
  type JsDocTagDoc,
  type Location,
} from "../deps.ts";
import { services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, splitMarkdownTitle, take } from "./utils.ts";
import { type Context, JsDoc, Markdown } from "./markdown.tsx";
import * as Icons from "../icons.tsx";

export const TARGET_RE = /(\s|[\[\]]|\.)/g;

export function nameToId(kind: string, name: string) {
  return `${kind}_${name.replaceAll(TARGET_RE, "_")}`;
}

export function Anchor({ children: name }: { children: string }) {
  return (
    <a
      href={`#${name}`}
      class={style("anchor")}
      aria-label="Anchor"
      tabIndex={-1}
    >
      <Icons.Link />
    </a>
  );
}

export function DocEntry(
  { children, tags, name, location, id, jsDoc, href, context }: {
    children: ComponentChildren;
    tags?: unknown[];
    name?: ComponentChildren;
    location: Location;
    id: string;
    jsDoc?: { doc?: string };
    href?: string;
    context: Context;
  },
) {
  const sourceHref = services.resolveSourceHref(
    location.filename,
    location.line,
  );

  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>

      <div class={style("docEntry")}>
        <span class={style("docEntryChildren")}>
          <span class={style("docEntryChildren")}>
            {!!tags?.length && <span class="space-x-1">{tags}</span>}

            <span class="font-mono">
              {name && href
                ? <a class="font-bold link" href={href}>{name}</a>
                : <span class="font-bold">{name}</span>}
              <span class="font-medium">{children}</span>
            </span>
          </span>
        </span>
        {sourceHref && (
          <a
            href={sourceHref}
            aria-label="Jump to src"
            target="_blank"
            class={style("sourceLink")}
          >
            <div class="hover:bg-gray-100 px-1 py-1 rounded-md">
              <Icons.LinkLine class="w-5 h-5" />
            </div>
          </a>
        )}
      </div>

      <div class="pl-5">
        <JsDoc context={context}>
          {jsDoc}
        </JsDoc>
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: Child<string> }) {
  const name = take(children);
  const id = name.replaceAll(TARGET_RE, "_");
  return (
    <h2 class={style("section")} id={id}>
      <a href={`#${id}`} aria-label="Anchor">
        {name}
      </a>
    </h2>
  );
}

export function Section(
  { children, title }: { children: Child<unknown[]>; title: string },
) {
  const entries = take(children, true);
  if (entries.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <div class="mt-2 space-y-7">
        {entries}
      </div>
    </div>
  );
}

export function Examples(
  { children, context }: {
    children: Child<JsDocType | undefined>;
    context: Context;
  },
) {
  const jsdoc = take(children);
  const examples =
    (jsdoc?.tags?.filter((tag) => tag.kind === "example" && tag.doc) ??
      []) as JsDocTagDoc[];

  if (examples.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionTitle>Examples</SectionTitle>
      <div class="mt-2 space-y-3">
        {examples.map((example, i) => (
          <Example context={context} n={i}>{example.doc!}</Example>
        ))}
      </div>
    </div>
  );
}

function Example(
  { children, n, context }: {
    children: Child<string>;
    n: number;
    context: Context;
  },
) {
  const md = take(children);
  const [summary, body] = splitMarkdownTitle(md);

  const id = `example_${n}`;

  return (
    <div class="group">
      <Anchor>{id}</Anchor>
      <details class={style("details")} id={id}>
        <summary class="flex items-center gap-2 py-2 px-3 rounded-lg w-full leading-6 hover:children:first-child:text-gray-500">
          <Icons.TriangleRight
            tabindex={0}
            onKeyDown="if (event.code === 'Space' || event.code === 'Enter') { this.parentElement.click(); event.preventDefault(); }"
          />
          <Markdown context={context} summary>
            {summary || `Example ${n + 1}`}
          </Markdown>
        </summary>

        <Markdown context={context}>
          {body}
        </Markdown>
      </details>
    </div>
  );
}

export const tagColors = {
  purple: ["[#7B61FF1A]", "[#7B61FF]"],
  cyan: ["[#0CAFC619]", "[#0CAFC6]"],
  gray: ["gray-100", "gray-400"],
} as const;

export function Tag(
  { children, color, large }: {
    children: ComponentChildren;
    color: keyof typeof tagColors;
    large?: boolean;
  },
) {
  const [bg, text] = tagColors[color];
  return (
    <div
      class={`bg-${bg} text-${text} ${large ? "py-2 px-3" : "py-1 px-2"} ${
        style("tag")
      }`}
    >
      {children}
    </div>
  );
}

export const tagVariants = {
  reExportLg: () => <Tag color="purple" large>Re-export</Tag>,
  deprecatedLg: () => (
    <Tag color="gray" large>
      <Icons.ExclamationMark />
      <span>Deprecated</span>
    </Tag>
  ),
  deprecated: () => <Tag color="gray">deprecated</Tag>,
  abstractLg: () => <Tag color="cyan" large>Abstract</Tag>,
  abstract: () => <Tag color="cyan">abstract</Tag>,
  unstableLg: () => <Tag color="gray" large>Unstable</Tag>,
  unstable: () => <Tag color="gray">unstable</Tag>,
  readonly: () => <Tag color="purple">readonly</Tag>,
  writeonly: () => <Tag color="purple">writeonly</Tag>,
  optional: () => <Tag color="cyan">optional</Tag>,
} as const;

export function getAccessibilityTag(accessibility?: Accessibility) {
  if (!accessibility || accessibility === "public") {
    return null;
  }
  return <Tag color="purple">{accessibility}</Tag>;
}
