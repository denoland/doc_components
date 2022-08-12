// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import {
  type DocNode,
  type DocNodeInterface,
  type DocNodeTypeAlias,
  tw,
} from "./deps.ts";
import { byKind, isAbstract, isDeprecated } from "./doc.ts";
import { DocBlock } from "./doc_block.tsx";
import { Tag } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import * as Icons from "./icons.tsx";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { Usage } from "./usage.tsx";
import { type Child, maybe, take } from "./utils.ts";
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
  return (
    <article class={style("main")}>
      <div class={style("symbolDocHeader")}>
        <div>
          <DocTitle>{docNodes}</DocTitle>
          {maybe(isAbstract(docNodes[0]), <Tag color="yellow">abstract</Tag>)}
          {maybe(isDeprecated(docNodes[0]), <Tag color="gray">deprecated</Tag>)}
        </div>
        <a
          href={services.resolveSourceHref(location.filename, location.line)}
          class={style("sourceButton")}
        >
          <Icons.SourceFile />
        </a>
      </div>
      <div class={tw`space-y-3`}>
        {maybe(
          !(url.endsWith(".d.ts") || library),
          <Usage url={url} name={title} isType={isTypeOnly(docNodes)} />,
        )}
        <JsDoc tagKinds="deprecated" tagsWithDoc {...markdownContext}>
          {jsDoc}
        </JsDoc>
      </div>
      <DocBlock {...markdownContext}>{docNodes}</DocBlock>
    </article>
  );
}
