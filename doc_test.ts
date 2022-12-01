// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "./deps_test.ts";
import { type DocNode } from "./deps.ts";
import { byKind } from "./doc/doc.ts";
import { processProperty, splitMarkdownTitle } from "./doc/utils.ts";

Deno.test({
  name: "doc - sort by kind",
  fn() {
    const fixtures: DocNode[] = [
      {
        name: "namespace",
        kind: "namespace",
        namespaceDef: { elements: [] },
        location: { filename: "", line: 0, col: 0 },
        declarationKind: "export",
      },
      {
        name: "fn",
        kind: "function",
        functionDef: {
          params: [],
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
        location: { filename: "", line: 0, col: 0 },
        declarationKind: "export",
      },
      {
        name: "A",
        kind: "interface",
        interfaceDef: {
          extends: [],
          methods: [],
          properties: [],
          callSignatures: [],
          indexSignatures: [],
          typeParams: [],
        },
        location: { filename: "", line: 0, col: 0 },
        declarationKind: "export",
      },
    ];
    fixtures.sort(byKind);
    assertEquals(fixtures.map(({ kind }) => kind), [
      "namespace",
      "interface",
      "function",
    ]);
  },
});

Deno.test("splitMarkdownTitle - simple", () => {
  const markdown = `some text

\`\`\`
// comment
\`\`\`
  `;
  const [summary, body] = splitMarkdownTitle(markdown);
  assertEquals(summary, "some text");
  assertEquals(
    body,
    `\`\`\`
// comment
\`\`\``,
  );
});

Deno.test("splitMarkdownTitle - markdown only", () => {
  const markdown = `\`\`\`
// comment
\`\`\`
  `;
  const [summary, body] = splitMarkdownTitle(markdown);
  assertEquals(summary, "");
  assertEquals(
    body,
    `\`\`\`
// comment
\`\`\``,
  );
});

Deno.test("splitMarkdownTitle - summary only", () => {
  const markdown = "some text";
  const [summary, body] = splitMarkdownTitle(markdown);
  assertEquals(summary, "some text");
  assertEquals(body, "");
});

Deno.test("splitMarkdownTitle - paragraphs only", () => {
  const markdown = `some text

hello world`;
  const [summary, body] = splitMarkdownTitle(markdown);
  assertEquals(summary, "some text");
  assertEquals(body, "hello world");
});

Deno.test("splitMarkdownTitle - tight", () => {
  const markdown = `some text
\`\`\`
// comment
\`\`\`
  `;
  const [summary, body] = splitMarkdownTitle(markdown);
  assertEquals(summary, "some text");
  assertEquals(
    body,
    `\`\`\`
// comment
\`\`\``,
  );
});

Deno.test("processProperty - prototype", () => {
  const [property, isPrototype] = processProperty("prototype.foo");
  assertEquals(property, "foo");
  assertEquals(isPrototype, true);
});

Deno.test("processProperty - static", () => {
  const [property, isPrototype] = processProperty("foo");
  assertEquals(property, "foo");
  assertEquals(isPrototype, false);
});

Deno.test("processProperty - prototype compute", () => {
  const [property, isPrototype] = processProperty(
    "prototype.[Symbol.iterator]",
  );
  assertEquals(property, "[Symbol.iterator]");
  assertEquals(isPrototype, true);
});

Deno.test("processProperty - static compute", () => {
  const [property, isPrototype] = processProperty("[Symbol.iterator]");
  assertEquals(property, "[Symbol.iterator]");
  assertEquals(isPrototype, false);
});
