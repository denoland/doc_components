// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type Accessibility, type Location, tw } from "./deps.ts";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { type Child, take } from "./utils.ts";

export const TARGET_RE = /(\s|[\[\]])/g;

export function nameToId(kind: string, name: string) {
  return `${kind}_${name.replaceAll(TARGET_RE, "_")}`;
}

export function AccessibilityTag(
  { children }: { children: Child<Accessibility | undefined> },
) {
  const accessibility = take(children);
  if (!accessibility || accessibility === "public") {
    return null;
  }
  const color = accessibility === "private" ? "pink" : "indigo";
  return <Tag color={color}>{accessibility}</Tag>;
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
  { children, location: { filename, line } }: {
    children: unknown;
    location: Location;
  },
) {
  const href = services.resolveSourceHref(filename, line);
  return (
    <div class={style("docEntry")}>
      <div class={style("docEntryChildren")}>{children}</div>
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

export function Tag(
  { children, color = "gray" }: { children: unknown; color: string },
) {
  return (
    <span>
      {" "}
      <span
        class={tw`bg-${color}(100 dark:800) whitespace-nowrap text-${color}(800 dark:100) ${
          style("tag", true)
        }`}
      >
        {children}
      </span>
    </span>
  );
}
