// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNode } from "../deps.ts";
import { runtime, setup, theme } from "../services.ts";
import {
  Application,
  colors,
  Fragment,
  getStyleTag,
  h,
  HttpError,
  renderSSR,
  Router,
  virtualSheet,
} from "./deps.ts";
import {
  Showcase,
  ShowcaseCodeBlocks,
  ShowcaseDocBlocks,
} from "./showcase.tsx";
import { getDocNodes, getModuleIndex } from "./util.ts";

const sheet = virtualSheet();
const page = "/";

await setup({
  lookupHref(url, namespace, symbol) {
    return namespace
      ? `/${url}/~/${namespace}.${symbol}`
      : `/${url}/~/${symbol}`;
  },
  resolveHref(url, symbol) {
    if (symbol) {
      return `https://doc.deno.land/${url}/~/${symbol}`;
    }
    const pattern = new URLPattern(
      "https://deno.land/x/:module@:version/:path*",
    );
    const result = pattern.exec(url);
    if (result) {
      const { module, version, path } = result.pathname.groups;
      return `${page}/${module}/${version}/${path}`;
    }
    return `/${url}`;
  },
  runtime: { Fragment, h },
  tw: { sheet, theme, darkMode: "class" },
});

const router = new Router();

router.get("/", async (ctx, next) => {
  sheet.reset();
  const moduleIndex = await getModuleIndex("std", "0.142.0");
  const docNodes = await getDocNodes("oak", "v10.6.0", "/mod.ts");
  const body = renderSSR(
    <Showcase
      url="https://deno.land/x/oak@v10.5.1/mod.ts"
      symbol="Application"
      moduleIndex={moduleIndex}
      docNodes={docNodes}
    />,
  );
  const styles = getStyleTag(sheet);
  ctx.response.body = `<!DOCTYPE html>
  <html lang="en">
    <head>
      ${styles}
    </head>
    <body>
      ${body}
    </body>
  </html>`;
  ctx.response.type = "html";
  await next();
});

router.get("/codeblocks", async (ctx, next) => {
  sheet.reset();
  const docNodes = await getDocNodes("oak", "v10.6.0", "/mod.ts");
  const body = renderSSR(
    <ShowcaseCodeBlocks
      url="https://deno.land/x/oak@v10.6.0/mod.ts"
      docNodes={docNodes}
    />,
  );
  const styles = getStyleTag(sheet);
  ctx.response.body = `<!DOCTYPE html>
  <html lang="en">
    <head>
      ${styles}
    </head>
    <body>
      ${body}
    </body>
  </html>`;
  ctx.response.type = "html";
  await next();
});

router.get("/docblocks", async (ctx, next) => {
  sheet.reset();
  // const docNodes = await getDocNodes("oak", "v10.6.0", "/mod.ts");
  const docNodes: DocNode[] = [{
    name: "AClass",
    kind: "class",
    location: {
      filename: "https://deno.land/x/mod/mod.ts",
      line: 23,
      col: 0,
    },
    declarationKind: "export",
    classDef: {
      isAbstract: false,
      constructors: [{
        name: "new",
        params: [{
          kind: "identifier",
          name: "a",
          tsType: {
            kind: "keyword",
            keyword: "string",
            repr: "string",
          },
          optional: false,
        }],
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 25,
          col: 2,
        },
        jsDoc: {
          doc: "Some sort of doc `here`. **love it**",
          tags: [{
            kind: "deprecated",
            doc: "some deprecated doc",
          }, {
            kind: "param",
            name: "a",
            doc: "some param _doc_",
          }],
        },
      }],
      properties: [{
        tsType: {
          kind: "keyword",
          keyword: "number",
          repr: "number",
        },
        readonly: false,
        optional: true,
        isAbstract: false,
        isStatic: false,
        name: "someNumber",
        decorators: [{
          name: "log",
          location: {
            filename: "https://deno.land/x/mod/mod.ts",
            line: 30,
            col: 2,
          },
        }],
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 31,
          col: 2,
        },
      }, {
        jsDoc: {
          doc: "some property JSDoc",
          tags: [{ kind: "deprecated" }],
        },
        tsType: {
          kind: "keyword",
          keyword: "string",
          repr: "string",
        },
        readonly: true,
        accessibility: "protected",
        optional: false,
        isAbstract: false,
        isStatic: false,
        name: "prop1",
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 30,
          col: 2,
        },
      }],
      indexSignatures: [],
      methods: [{
        kind: "getter",
        name: "value",
        optional: false,
        isAbstract: false,
        isStatic: false,
        functionDef: {
          params: [],
          returnType: {
            kind: "keyword",
            keyword: "string",
            repr: "string",
          },
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 26,
          col: 2,
        },
      }, {
        kind: "method",
        name: "stringify",
        optional: true,
        isAbstract: false,
        isStatic: true,
        functionDef: {
          params: [{
            kind: "identifier",
            name: "value",
            optional: false,
            tsType: {
              kind: "keyword",
              keyword: "unknown",
              repr: "unknown",
            },
          }],
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
        jsDoc: {
          doc: "some js doc for the method",
          tags: [{
            kind: "param",
            name: "value",
            doc: "the value to stringify",
          }],
        },
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 27,
          col: 2,
        },
      }, {
        kind: "setter",
        name: "other",
        optional: false,
        isAbstract: false,
        isStatic: false,
        functionDef: {
          params: [{
            kind: "identifier",
            name: "value",
            optional: false,
            tsType: {
              kind: "keyword",
              keyword: "string",
              repr: "string",
            },
          }],
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 26,
          col: 2,
        },
      }, {
        kind: "getter",
        name: "other",
        optional: false,
        isAbstract: false,
        isStatic: false,
        functionDef: {
          params: [],
          returnType: {
            kind: "keyword",
            keyword: "string",
            repr: "string",
          },
          isAsync: false,
          isGenerator: false,
          typeParams: [],
        },
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 26,
          col: 2,
        },
      }],
      extends: "Other",
      implements: [{
        kind: "typeRef",
        typeRef: { typeName: "AnInterface" },
        repr: "AnInterface<T>",
      }, {
        kind: "typeRef",
        typeRef: { typeName: "OtherInterface" },
        repr: "OtherInterface",
      }],
      typeParams: [{
        name: "T",
        constraint: { kind: "keyword", keyword: "string", repr: "string" },
      }],
      superTypeParams: [{
        kind: "literal",
        literal: {
          kind: "string",
          string: "other",
        },
        repr: "string",
      }, {
        kind: "typeRef",
        typeRef: { typeName: "Value" },
        repr: "Value",
      }],
      decorators: [{
        name: "debug",
        args: ["arg"],
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 22,
          col: 0,
        },
      }],
    },
  }];
  const body = renderSSR(
    <ShowcaseDocBlocks
      url="https://deno.land/x/oak@v10.6.0/mod.ts"
      docNodes={docNodes}
    />,
  );
  const styles = getStyleTag(sheet);
  ctx.response.body = `<!DOCTYPE html>
  <html lang="en">
    <head>
      ${styles}
    </head>
    <body>
      ${body}
    </body>
  </html>`;
  ctx.response.type = "html";
  await next();
});

const app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  const c = ctx.response.status >= 500
    ? colors.red
    : ctx.response.status >= 400
    ? colors.yellow
    : colors.green;
  console.log(
    `${c(ctx.request.method)} ${colors.gray(`(${ctx.response.status})`)} - ${
      colors.cyan(`${ctx.request.url.pathname}${ctx.request.url.search}`)
    } - ${colors.bold(String(rt))}`,
  );
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ secure, hostname, port }) =>
  console.log(
    `${colors.yellow("Listening on")}: ${
      secure ? "https" : "http"
    }://${hostname}:${port}/`,
  ));
app.addEventListener("error", (evt) => {
  let msg = `[${colors.red("error")}] `;
  if (evt.error instanceof Error) {
    msg += `${evt.error.name}: ${evt.error.message}`;
  } else {
    msg += Deno.inspect(evt.error);
  }
  if (
    (evt.error instanceof HttpError && evt.error.status >= 400 &&
      evt.error.status <= 499)
  ) {
    if (evt.context) {
      msg += `\n\nrequest:\n  url: ${evt.context.request.url}\n  headers: ${
        Deno.inspect([...evt.context.request.headers])
      }\n`;
    }
  }
  if (evt.error instanceof Error && evt.error.stack) {
    const stack = evt.error.stack.split("\n");
    stack.shift();
    msg += `\n\n${stack.join("\n")}\n`;
  }
  console.error(msg);
});

app.listen({ port: 3100 });
