// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type Accessibility, type Location, tw } from "../deps.ts";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, take } from "./utils.ts";
import { JsDoc } from "./jsdoc.tsx";
import { Context } from "./markdown.tsx";
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
    children: unknown;
    tags?: unknown[];
    name?: unknown;
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

  const docEntryChildren = (
    <>
      {!!tags?.length && <span class={tw`space-x-1`}>{tags}</span>}
      <span class={tw`font-mono`}>
        {name && <span class={tw`font-bold`}>{name}</span>}
        <span class={tw`font-medium`}>{children}</span>
      </span>
    </>
  );

  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>

      <div class={style("docEntry")}>
        <span class={style("docEntryChildren")}>
          {href
            ? (
              <a class={style("docEntryChildrenHref")} href={href}>
                {docEntryChildren}
              </a>
            )
            : (
              <span class={style("docEntryChildren")}>
                {docEntryChildren}
              </span>
            )}
          <span class={tw`font-mono`}>
            {name && <span class={tw`font-bold`}>{name}</span>}
            <span class={tw`font-medium`}>{children}</span>
          </span>
        </span>
        {sourceHref && (
          <a href={sourceHref} target="_blank" class={style("sourceLink")}>
            [src]
          </a>
        )}
      </div>

      <div class={tw`pl-5`}>
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
      <div class={tw`mt-2 space-y-7`}>
        {entries}
      </div>
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
    children: unknown;
    color: keyof typeof tagColors;
    large?: boolean;
  },
) {
  const [bg, text] = tagColors[color];
  return (
    <div
      class={tw`bg-${bg} text-${text} ${large ? "py-2 px-3" : "py-1 px-2"} ${
        style("tag")
      }`}
    >
      {children}
    </div>
  );
}

export const tagVariants = {
  deprecatedLg: () => <Tag color="gray" large>Deprecated</Tag>,
  deprecated: () => <Tag color="gray">deprecated</Tag>,
  abstractLg: () => <Tag color="cyan" large>Abstract</Tag>,
  abstract: () => <Tag color="cyan">abstract</Tag>,
  readonly: () => <Tag color="purple">readonly</Tag>,
  writeonly: () => <Tag color="purple">readonly</Tag>,
  optional: () => <Tag color="cyan">optional</Tag>,
  unstableLg: () => <Tag color="gray" large>Unstable</Tag>,
  unstable: () => <Tag color="gray">unstable</Tag>,
} as const;

export function getAccessibilityTag(accessibility?: Accessibility) {
  if (!accessibility || accessibility === "public") {
    return null;
  }
  return <Tag color="purple">{accessibility}</Tag>;
}
