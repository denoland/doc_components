// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  type DocNode,
  type DocNodeInterface,
  type DocNodeTypeAlias,
  type JsDocTagTags,
  tw,
} from "../deps.ts";
import { byKind } from "./doc.ts";
import { DocBlock } from "./doc_block.tsx";
import { Tag, tagVariants } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import * as Icons from "../icons.tsx";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { Usage } from "./usage.tsx";
import { type Child, isAbstract, isDeprecated, take } from "./utils.ts";
import { DocTitle } from "./doc_title.tsx";
import { type MarkdownContext } from "./markdown.tsx";

function isTypeOnly(
  docNodes: DocNode[],
): docNodes is (DocNodeInterface | DocNodeTypeAlias)[] {
  return docNodes.every(({ kind }) =>
    kind === "interface" || kind === "typeAlias"
  );
}

export function SymbolDoc(
  { children, library = false, url, namespace }: {
    children: Child<DocNode[]>;
    library?: boolean;
    url: string;
    namespace?: string;
  },
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

  const title = namespace
    ? `${namespace}.${docNodes[0].name}`
    : docNodes[0].name;
  const markdownContext = { url, namespace };
  const showUsage = !(url.endsWith(".d.ts") || library);

  return (
    <article class={style("symbolDoc")}>
      {Object.values(splitNodes).map((nodes) => (
        <Symbol
          showUsage={showUsage}
          title={title}
          markdownContext={markdownContext}
        >
          {nodes}
        </Symbol>
      ))}
    </article>
  );
}

function Symbol(
  { children, showUsage, title, markdownContext }: {
    children: Child<DocNode[]>;
    showUsage: boolean;
    title: string;
    markdownContext: MarkdownContext;
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
  if (jsDocTags.length !== 0) {
    tags.push(
      <Tag color="cyan" large>
        <span class={tw`space-x-2`}>
          {jsDocTags.map((tag, i) => (
            <>
              {i !== 0 && <div class={tw`inline border-l-2 border-gray-300`} />}
              <span>{tag}</span>
            </>
          ))}
        </span>
      </Tag>,
    );
  }

  if (isAbstract(docNodes[0])) {
    tags.push(tagVariants.abstractLg());
  }
  if (isDeprecated(docNodes[0])) {
    tags.push(tagVariants.deprecatedLg());
  }

  return (
    <div class={tw`space-y-7`}>
      <div class={style("symbolDocHeader")}>
        <div class={tw`space-y-2`}>
          <DocTitle markdownContext={markdownContext}>{docNodes[0]}</DocTitle>

          {tags.length !== 0 && (
            <div>
              {tags}
            </div>
          )}
        </div>
        <a
          href={services.resolveSourceHref(
            docNodes[0].location.filename,
            docNodes[0].location.line,
          )}
          class={tw`icon-button`}
        >
          <Icons.Source />
        </a>
      </div>

      <div class={tw`space-y-3`}>
        {showUsage && (
          <Usage
            url={markdownContext.url}
            name={title}
            isType={isTypeOnly(docNodes)}
          />
        )}
        {!isFunction && <JsDoc markdownContext={markdownContext}>{jsDoc}
        </JsDoc>}
      </div>

      <DocBlock markdownContext={markdownContext}>{docNodes}</DocBlock>
    </div>
  );
}
