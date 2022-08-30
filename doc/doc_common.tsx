// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type Accessibility, type Location, tw } from "../deps.ts";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, take } from "./utils.ts";

export const TARGET_RE = /(\s|[\[\]])/g;

export function nameToId(kind: string, name: string) {
  return `${kind}_${name.replaceAll(TARGET_RE, "_")}`;
}

export function getAccessibilityTag(accessibility?: Accessibility) {
  if (!accessibility || accessibility === "public") {
    return null;
  }
  return <Tag color="purple">{accessibility}</Tag>;
}

export function Anchor({ children: name }: { children: string }) {
  return (
    <a
      href={`#${name}`}
      class={style("anchor")}
      aria-label="Anchor"
      tabIndex={-1}
    >
      §
    </a>
  );
}

export function DocEntry(
  { children, tags, name, location: { filename, line } }: {
    children: unknown;
    tags?: unknown[];
    name: string;
    location: Location;
  },
) {
  const href = services.resolveSourceHref(filename, line);
  return (
    <div class={style("docEntry")}>
      <span class={style("docEntryChildren")}>
        {!!tags?.length && <span>{tags}</span>}
        <span class={tw`font-mono`}>
          <span class={tw`font-bold`}>{name}</span>
          <span class={tw`font-medium`}>{children}</span>
        </span>
      </span>
      {href && (
        <a href={href} target="_blank" class={style("sourceLink")}>[src]</a>
      )}
    </div>
  );
}

export function SectionSubTitle(
  { children, id: parentId }: { children: Child<string>; id: string },
) {
  const name = take(children);
  const id = nameToId(parentId, name);
  return (
    <h3 class={style("subSection")} id={id}>
      <Anchor>{id}</Anchor>
      {name}
    </h3>
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
        style("tag", true)
      }`}
    >
      {children}
    </div>
  );
}
