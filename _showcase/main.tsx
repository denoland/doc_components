// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import {
  Application,
  colors,
  Fragment,
  getStyleTag,
  h,
  HttpError,
  renderSSR,
  Router,
  setup,
  twColors,
  virtualSheet,
} from "./deps.ts";
import { runtime, setRuntime } from "../jsx.ts";
import { Showcase } from "./showcase.tsx";

setRuntime({ Fragment, h });

const sheet = virtualSheet();
setup({
  sheet,
  theme: {
    backgroundSize: {
      "4": "1rem",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: twColors.black,
      white: twColors.white,
      gray: twColors.coolGray,
      red: twColors.red,
      yellow: twColors.amber,
      green: twColors.emerald,
      cyan: twColors.cyan,
      blue: twColors.lightBlue,
      indigo: twColors.indigo,
      purple: twColors.fuchsia,
      pink: twColors.pink,
    },
    fontFamily: {
      "sans": [
        "Inter var",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
      ],
      "mono": [
        "Menlo",
        "Monaco",
        "Lucida Console",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
  },
});

const router = new Router();

router.get("/", async (ctx, next) => {
  sheet.reset();
  const body = renderSSR(<Showcase />);
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

app.listen();
