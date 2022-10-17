import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { setup } from "../../services.ts";

const page = "/";

export async function handler(_req: Request, ctx: MiddlewareHandlerContext) {
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
  });
  return ctx.next();
}
