// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { style } from "../styles.ts";
import { camelize, maybe, parseURL } from "./utils.ts";
import * as Icons from "../icons.tsx";
import { tw } from "../deps.ts";

interface ParsedUsage {
  /** The symbol that the item should be imported as. If `usageSymbol` and
   * `localVar` is defined, then the item is a named import, otherwise it is
   * a namespace import. */
  importSymbol: string;
  /** The undecorated code of the generated import statement to import and use
   * the item. */
  importStatement: string;
  /** The final specifier that should be used to import from. */
  importSpecifier: string;
  /** The local variable that the `usageSymbol` should be destructured out of.
   */
  localVar?: string;
  /** The symbol that should be destructured from the `localVar` which will be
   * bound to the item's value. */
  usageSymbol?: string;
}

/** Given the URL and optional item and is type flag, provide back a parsed
 * version of the usage of an item for rendering. */
export function parseUsage(
  url: string,
  item?: string,
  isType?: boolean,
  clearSearch = true,
): ParsedUsage {
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
    }${importSymbol} } from "${target.href}";\n`
    : `import * as ${importSymbol} from "${target.href}";\n`;
  // if we are using a symbol off a imported namespace, we need to destructure
  // it to a local variable.
  if (usageSymbol) {
    importStatement += `\nconst { ${usageSymbol} } = ${localVar};\n`;
  }
  return {
    importSymbol,
    usageSymbol,
    localVar,
    importStatement,
    importSpecifier: target.href,
  };
}

export function Usage(
  { url, name, isType }: { url: string; name?: string; isType?: boolean },
) {
  const {
    importSymbol,
    importStatement,
    importSpecifier,
    usageSymbol,
    localVar,
  } = parseUsage(url, name, isType, true);
  const onClick =
    // deno-lint-ignore no-explicit-any
    `navigator?.clipboard?.writeText('${importStatement.trim()}');` as any;
  return (
    <div class={style("markdown")}>
      <pre class={tw`flex items-center justify-between gap-2.5`}>
        <code class={tw`overflow-auto`}>
          <span class="code-keyword">import</span>
          {name
            ? (
              <span>
                {" "}&#123;{" "}
                {isType && <span class="code-keyword">type{" "}</span>}
                {importSymbol} &#125;{" "}
              </span>
            )
            : (
              <span>
                {" "}* <span class="code-keyword">as</span> {importSymbol}
                {" "}
              </span>
            )}
          <span class="code-keyword">from</span>{" "}
          <span class="code-string">"{importSpecifier}"</span>;{maybe(
            usageSymbol,
            <div>
              <br />
              <span class="code-keyword">const</span> &#123; {usageSymbol}{" "}
              &#125; = {localVar};
            </div>,
          )}
        </code>
        <button
          class={style("copyButton")}
          onClick={onClick}
        >
          <Icons.Copy />
        </button>
      </pre>
    </div>
  );
}
