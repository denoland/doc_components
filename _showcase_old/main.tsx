// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type DocNode } from "../deps.ts";
import {
  classNode,
  enumNode,
  fnNodes,
  interfaceNode,
  namespaceNode,
  typeAliasNode,
} from "./fixtures.ts";
import { plugins, setup, theme } from "../services.ts";
import {
  Application,
  colors,
  getStyleTag,
  HttpError,
  renderSSR,
  Router,
  virtualSheet,
} from "./deps.ts";
import { Showcase, ShowcaseDocBlocks } from "./showcase.tsx";
import { getModuleDoc, getModuleIndex, getSymbolDoc } from "./util.ts";

const sheet = virtualSheet();
const page = "/";

await setup({
  lookupHref(url, namespace, symbol) {
    return namespace
      ? `/${url.href}/~/${namespace}.${symbol}`
      : `/${url.href}/~/${symbol}`;
  },
  resolveHref(url, symbol) {
    if (symbol) {
      return `https://doc.deno.land/${url.href}/~/${symbol}`;
    }
    const pattern = new URLPattern(
      "https://deno.land/x/:module@:version/:path*",
    );
    const result = pattern.exec(url.href);
    if (result) {
      const { module, version, path } = result.pathname.groups;
      return `${page}/${module}/${version}/${path}`;
    }
    return `/${url.href}`;
  },
  tw: { sheet, theme, plugins, darkMode: "class" },
});

const router = new Router();

router.get("/", async (ctx, next) => {
  sheet.reset();
  const moduleIndex = await getModuleIndex();
  const moduleDoc = await getModuleDoc();
  const symbolDoc = await getSymbolDoc();
  const body = renderSSR(
    <Showcase
      url={new URL("https://deno.land/x/oak@v11.0.0/mod.ts")}
      symbol="Application"
      moduleIndex={moduleIndex}
      moduleDoc={moduleDoc}
      symbolDoc={symbolDoc}
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
  const docNodes: DocNode[] = [
    classNode,
    enumNode,
    interfaceNode,
    ...fnNodes,
    typeAliasNode,
    namespaceNode,
  ];
  const body = renderSSR(
    <ShowcaseDocBlocks
      url={new URL("https://deno.land/x/oak@v10.6.0/mod.ts")}
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
