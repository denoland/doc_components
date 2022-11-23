// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import {
  type DocNode,
  type DocNodeInterface,
  type DocNodeTypeAlias,
  type JsDocTagTags,
} from "../deps.ts";
import { byKind } from "./doc.ts";
import { DocBlock } from "./doc_block.tsx";
import { Tag, tagVariants } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import * as Icons from "../icons.tsx";
import { services } from "../services.ts";
import { style } from "../styles.ts";
import { Usage } from "./usage.tsx";
import { type Child, isAbstract, isDeprecated, take } from "./utils.ts";
import { DocTitle } from "./doc_title.tsx";
import { type Context, Markdown } from "./markdown.tsx";

function isTypeOnly(
  docNodes: DocNode[],
): docNodes is (DocNodeInterface | DocNodeTypeAlias)[] {
  return docNodes.every(({ kind }) =>
    kind === "interface" || kind === "typeAlias"
  );
}

export function SymbolDoc(
  { children, name, library = false, ...context }: {
    children: Child<DocNode[]>;
    name: string;
    library?: boolean;
  } & Pick<Context, "url" | "replacers">,
) {
  const docNodes = [...take(children, true)];
  docNodes.sort(byKind);
  const splitNodes: Record<string, DocNode[]> = {};
  for (const docNode of docNodes) {
    if (!(docNode.kind in splitNodes)) {
      splitNodes[docNode.kind] = [];
    }
    splitNodes[docNode.kind].push(docNode);
  }

  const showUsage = !(context.url.href.endsWith(".d.ts") || library);

  return (
    <article class={style("symbolDoc")}>
      {Object.values(splitNodes).map((nodes) => (
        <Symbol showUsage={showUsage} name={name} context={context}>
          {nodes}
        </Symbol>
      ))}
    </article>
  );
}

function Symbol(
  { children, showUsage, name, context }: {
    children: Child<DocNode[]>;
    showUsage: boolean;
    name: string;
    context: Context;
  },
) {
  const docNodes = take(children, true);
  const jsDoc = docNodes.map(({ jsDoc }) => jsDoc).find((jsDoc) => !!jsDoc);
  const isFunction = docNodes[0].kind === "function";

  const tags = [];

  const jsDocTags: string[] = docNodes.flatMap(({ jsDoc }) =>
    (jsDoc?.tags?.filter(({ kind }) => kind === "tags") as
      | JsDocTagTags[]
      | undefined)?.flatMap(({ tags }) => tags) ?? []
  );

  const permTags = jsDocTags.filter((tag, i) =>
    tag.startsWith("allow-") && jsDocTags.indexOf(tag) === i
  );
  if (permTags.length !== 0) {
    tags.push(
      <Tag color="cyan" large>
        <span class="space-x-2">
          {permTags.map((tag, i) => (
            <>
              {i !== 0 && <div class="inline border-l-2 border-gray-300" />}
              <span>{tag}</span>
            </>
          ))}
        </span>
      </Tag>,
    );
  }

  if (jsDocTags.includes("unstable")) {
    tags.push(tagVariants.unstableLg());
  }

  if (isAbstract(docNodes[0])) {
    tags.push(tagVariants.abstractLg());
  }
  const deprecated = isDeprecated(docNodes[0]);
  if (deprecated) {
    tags.push(tagVariants.deprecatedLg());
  }

  const lastSymbolIndex = name.lastIndexOf(".");
  context.namespace = lastSymbolIndex !== -1
    ? name.slice(0, lastSymbolIndex)
    : undefined;

  return (
    <div class="space-y-8">
      <div class={style("symbolDocHeader")}>
        <div class="space-y-2">
          <DocTitle name={name} context={context}>
            {docNodes[0]}
          </DocTitle>

          {tags.length !== 0 && (
            <div class="space-x-2">
              {tags}
            </div>
          )}
        </div>
        <a
          href={services.resolveSourceHref(
            docNodes[0].location.filename,
            docNodes[0].location.line,
          )}
          class="icon-button"
        >
          <Icons.Source />
        </a>
      </div>

      {deprecated?.doc && (
        <div>
          <div class="py-1 text-danger flex gap-1 items-center">
            <Icons.TrashCan class="h-4 w-auto" />
            <span class="font-bold leading-6">
              Deprecated
            </span>
          </div>

          <div class="p-2.5 border-l-4 border-[#F00C084C]">
            <Markdown context={context}>{deprecated.doc}</Markdown>
          </div>
        </div>
      )}

      <div class="space-y-3">
        {showUsage && (
          <Usage
            url={context.url}
            name={name}
            isType={isTypeOnly(docNodes)}
          />
        )}
        {!isFunction && <JsDoc context={context}>{jsDoc}</JsDoc>}
      </div>

      <DocBlock name={name} context={context}>
        {docNodes}
      </DocBlock>
    </div>
  );
}
