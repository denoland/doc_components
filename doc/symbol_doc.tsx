// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  type DocNode,
  type DocNodeInterface,
  type DocNodeTypeAlias,
  tw,
} from "../deps.ts";
import { byKind } from "./doc.ts";
import { DocBlock } from "./doc_block.tsx";
import { Tag } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import * as Icons from "../icons.tsx";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { Usage } from "./usage.tsx";
import { type Child, isAbstract, isDeprecated, maybe, take } from "./utils.ts";
import { DocTitle } from "./doc_title.tsx";

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
  const jsDoc = docNodes.map(({ jsDoc }) => jsDoc).find((jsDoc) => !!jsDoc);
  const [{ name, location }] = docNodes;
  const title = namespace ? `${namespace}.${name}` : name;
  const markdownContext = { url, namespace };

  const tags = [];

  const jsDocTags: string[] = docNodes.flatMap(({ jsDoc }) =>
    jsDoc?.tags?.filter(({ kind }) => kind === "tags").flatMap(({ tags }) =>
      tags
    ) ?? []
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
    tags.push(<Tag color="cyan" large>Abstract</Tag>);
  }
  if (isDeprecated(docNodes[0])) {
    tags.push(<Tag color="gray" large>Deprecated</Tag>);
  }

  const isFunction = docNodes[0].kind === "function";

  return (
    <article class={style("main")}>
      <div class={style("symbolDocHeader")}>
        <div class={tw`space-y-2`}>
          <DocTitle {...markdownContext}>{docNodes}</DocTitle>

          {tags.length !== 0 && (
            <div>
              {tags}
            </div>
          )}
        </div>
        <a
          href={services.resolveSourceHref(location.filename, location.line)}
          class={tw`icon-button`}
        >
          <Icons.Source />
        </a>
      </div>
      <div class={tw`space-y-3`}>
        {maybe(
          !(url.endsWith(".d.ts") || library),
          <Usage url={url} name={title} isType={isTypeOnly(docNodes)} />,
        )}
        {!isFunction && (
          <JsDoc {...markdownContext}>
            {jsDoc}
          </JsDoc>
        )}
      </div>
      <DocBlock {...markdownContext}>{docNodes}</DocBlock>
    </article>
  );
}
