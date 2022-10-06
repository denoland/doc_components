// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  type DocNode,
  type DocNodeClass,
  type DocNodeFunction,
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
import { type Context } from "./markdown.tsx";

function isTypeOnly(
  docNodes: DocNode[],
): docNodes is (DocNodeInterface | DocNodeTypeAlias)[] {
  return docNodes.every(({ kind }) =>
    kind === "interface" || kind === "typeAlias"
  );
}

export function SymbolDoc(
  { children, name, library = false, property, ...context }: {
    children: Child<DocNode[]>;
    name: string;
    library?: boolean;
    property?: string;
  } & Pick<Context, "url" | "replacers">,
) {
  const docNodes = [...take(children, true)];
  docNodes.sort(byKind);
  let splitNodes: Record<string, DocNode[]> = {};
  for (const docNode of docNodes) {
    if (!(docNode.kind in splitNodes)) {
      splitNodes[docNode.kind] = [];
    }
    splitNodes[docNode.kind].push(docNode);
  }

  let propertyName: string | undefined;
  if (property && ("class" in splitNodes)) {
    const parts = property.split(".");

    const classNode = (splitNodes["class"] as DocNodeClass[])[0];
    const functionNodes: DocNodeFunction[] = classNode.classDef.methods.filter((
      def,
    ) => {
      if (parts[0] === "prototype") {
        return def.name === parts[1] && !def.isStatic;
      } else {
        return def.name === parts[0] && def.isStatic;
      }
    }).map((def) => {
      return {
        declarationKind: classNode.declarationKind,
        functionDef: def.functionDef,
        jsDoc: def.jsDoc,
        kind: "function",
        location: def.location,
        name: def.name,
      };
    });

    if (functionNodes.length !== 0) {
      splitNodes = { function: functionNodes };
      propertyName = `${classNode.name}.${property}`;
    }
  }
  console.log(propertyName);

  const showUsage = !(context.url.href.endsWith(".d.ts") || library);

  return (
    <article class={style("symbolDoc")}>
      {Object.values(splitNodes).map((nodes) => (
        <Symbol
          showUsage={showUsage}
          property={propertyName}
          name={name}
          context={context}
        >
          {nodes}
        </Symbol>
      ))}
    </article>
  );
}

function Symbol(
  { children, showUsage, property, name, context }: {
    children: Child<DocNode[]>;
    showUsage: boolean;
    property?: string;
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
        <span class={tw`space-x-2`}>
          {permTags.map((tag, i) => (
            <>
              {i !== 0 && <div class={tw`inline border-l-2 border-gray-300`} />}
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
  if (isDeprecated(docNodes[0])) {
    tags.push(tagVariants.deprecatedLg());
  }

  const lastSymbolIndex = name.lastIndexOf(".");
  context.namespace = lastSymbolIndex !== -1
    ? name.slice(0, lastSymbolIndex)
    : undefined;

  return (
    <div class={tw`space-y-7`}>
      <div class={style("symbolDocHeader")}>
        <div class={tw`space-y-2`}>
          <DocTitle property={property} name={name} context={context}>
            {docNodes[0]}
          </DocTitle>

          {tags.length !== 0 && (
            <div class={tw`space-x-2`}>
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
            url={context.url.href}
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
