// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

export type Child<T> = T | [T];

interface ParsedURL {
  registry: string;
  org?: string;
  package?: string;
  version?: string;
  module?: string;
}

export function assert(
  cond: unknown,
  message = "Assertion error",
): asserts cond {
  if (!cond) {
    throw new Error(message);
  }
}

/** Convert a string into a camelCased string. */
export function camelize(str: string): string {
  return str.split(/[\s_\-]+/).map((word, index) =>
    index === 0
      ? word.toLowerCase()
      : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
  ).join("");
}

/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T>(cond: unknown, isTrue: T): T | undefined;
/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T, F>(cond: unknown, isTrue: T, isFalse: F): T | F;
/** If the condition is true, return the `isTrue` value, other return `isFalse`
 * which defaults to `undefined`. */
export function maybe<T, F>(
  cond: unknown,
  isTrue: T,
  isFalse?: F,
): T | F | undefined {
  return cond ? isTrue : isFalse;
}

/** Patterns of "registries" which will be parsed to be displayed in a more
 * human readable way. */
const patterns = {
  "deno.land/x": [
    new URLPattern(
      "https://deno.land/x/:pkg([^@/]+){@}?:ver?/:mod*",
    ),
  ],
  "deno.land/std": [new URLPattern("https://deno.land/std{@}?:ver?/:mod*")],
  "nest.land": [new URLPattern("https://x.nest.land/:pkg([^@/]+)@:ver/:mod*")],
  "crux.land": [new URLPattern("https://crux.land/:pkg([^@/]+)@:ver")],
  "github.com": [
    new URLPattern(
      "https://raw.githubusercontent.com/:org/:pkg/:ver/:mod*",
    ),
    // https://github.com/denoland/deno_std/raw/main/http/mod.ts
    new URLPattern(
      "https://github.com/:org/:pkg/raw/:ver/:mod*",
    ),
  ],
  "gist.github.com": [
    new URLPattern(
      "https://gist.githubusercontent.com/:org/:pkg/raw/:ver/:mod*",
    ),
  ],
  "esm.sh": [
    new URLPattern(
      "http{s}?://esm.sh/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
    ),
    // https://cdn.esm.sh/v58/firebase@9.4.1/database/dist/database/index.d.ts
    new URLPattern(
      "http{s}?://cdn.esm.sh/:regver*/:org(@[^/]+)?/:pkg([^@/]+)@:ver/:mod*",
    ),
  ],
  "skypack.dev": [
    new URLPattern({
      protocol: "https",
      hostname: "cdn.skypack.dev",
      pathname: "/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
      search: "*",
    }),
    // https://cdn.skypack.dev/-/@firebase/firestore@v3.4.3-A3UEhS17OZ2Vgra7HCZF/dist=es2019,mode=types/dist/index.d.ts
    new URLPattern(
      "https://cdn.skypack.dev/-/:org(@[^/]+)?/:pkg([^@/]+)@:ver([^-]+):hash/:path*",
    ),
  ],
  "unpkg.com": [
    new URLPattern(
      "https://unpkg.com/:org(@[^/]+)?/:pkg([^@/]+){@}?:ver?/:mod?",
    ),
  ],
};

/** Take a string URL and attempt to pattern match it against a known registry
 * and returned the parsed structure. */
export function parseURL(url: string): ParsedURL | undefined {
  for (const [registry, pattern] of Object.entries(patterns)) {
    for (const pat of pattern) {
      const match = pat.exec(url);
      if (match) {
        let { pathname: { groups: { regver, org, pkg, ver, mod } } } = match;
        if (registry === "gist.github.com") {
          pkg = pkg.substring(0, 7);
          ver = ver.substring(0, 7);
        }
        return {
          registry: regver ? `${registry} @ ${regver}` : registry,
          org: org || undefined,
          package: pkg || undefined,
          version: ver || undefined,
          module: mod || undefined,
        };
      }
    }
  }
}

/** A utility function that inspects a value, and if the value is an array,
 * returns the first element of the array, otherwise returns the value. This is
 * used to deal with the ambiguity around children properties with nano_jsx. */
export function take<T>(value: Child<T>, itemIsArray = false): T {
  if (itemIsArray) {
    return Array.isArray(value) && Array.isArray(value[0]) ? value[0] : // deno-lint-ignore no-explicit-any
      value as any;
  } else {
    return Array.isArray(value) ? value[0] : value;
  }
}
