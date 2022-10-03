// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { camelize, maybe, parseURL } from "./utils.ts";
import * as Icons from "../icons.tsx";
import { tw } from "../deps.ts";
import { Markdown } from "./markdown.tsx";

/** Given the URL and optional item and is type flag, provide back a parsed
 * version of the usage of an item for rendering. */
export function parseUsage(
  url: URL,
  item?: string,
  isType?: boolean,
  clearSearch = true,
): string {
  const parsed = parseURL(url);
  const target = new URL(url);
  if (clearSearch) {
    target.search = "";
  }
  const itemParts = item?.split(".");
  // when the imported symbol is a namespace import, we try to guess at an
  // intelligent camelized name for the import based on the package name.  If
  // it is a named import, we simply import the symbol itself.
  const importSymbol = itemParts
    ? itemParts[0]
    : camelize(parsed?.package ?? "mod");
  // when using a symbol from an imported namespace exported from a module, we
  // need to create the local symbol, which we identify here.
  const usageSymbol = itemParts && itemParts.length > 1
    ? itemParts.pop()
    : undefined;
  // if it is namespaces within namespaces, we simply re-join them together
  // instead of trying to figure out some sort of nested restructuring
  const localVar = itemParts?.join(".");
  // we create an import statement which is used to populate the copy paste
  // snippet of code.
  let importStatement = item
    ? `import { ${
      isType ? "type " : ""
    }${importSymbol} } from "${target.toString()}";\n`
    : `import * as ${importSymbol} from "${target.toString()}";\n`;
  // if we are using a symbol off a imported namespace, we need to destructure
  // it to a local variable.
  if (usageSymbol) {
    importStatement += `\nconst { ${usageSymbol} } = ${localVar};`;
  }
  return importStatement;
}

export function Usage(
  { url, name, isType }: { url: URL; name?: string; isType?: boolean },
) {
  const importStatement = parseUsage(url, name, isType);
  return (
    <div class={tw`w-full relative`}>
      <Markdown markdownContext={{ url }}>
        {`\`\`\`typescript\n${importStatement}\`\`\``}
      </Markdown>

      <button
        class={style("copyButton") + " " + tw`absolute right-4`}
        onClick={`navigator?.clipboard?.writeText('${importStatement}');`}
      >
        <Icons.Copy />
      </button>
    </div>
  );
}
