// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeFunction } from "./deps.ts";
import { Anchor, DocEntry, nameToId, Tag } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { MarkdownContext } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { TypeDef, TypeParams } from "./types.tsx";
import { type Child, isDeprecated, maybe, take } from "./utils.ts";

export function CodeBlockFn({ children, ...props }: {
  children: Child<DocNodeFunction[]>;
  url: string;
  namespace?: string;
}) {
  const fns = take(children, true);
  const items = fns.map(({
    name,
    functionDef: { isAsync, isGenerator, typeParams, params, returnType },
  }) => (
    <div>
      <span class={style("codeKeyword")}>
        {isAsync ? "async " : undefined}function{isGenerator ? "* " : " "}
      </span>
      <span class={style("codeFnName")}>{name}</span>
      <TypeParams code {...props}>{typeParams}</TypeParams>(<Params
        code
        {...props}
      >
        {params}
      </Params>){returnType
        ? (
          <>
            : <TypeDef code terminate {...props}>{returnType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("codeBlock")}>{items}</div>;
}

export function DocBlockFn(
  { children, ...markdownContext }:
    & { children: Child<DocNodeFunction[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);
  // when there is only one definition, it is assumed that the JSDoc will be
  // displayed outside of the DocBlock. When there are multiple overloads
  // though, any JSDoc will be associated with each overload.
  const isSingle = defs.length === 1;
  const items = defs.map(
    (
      {
        location,
        name,
        jsDoc,
        functionDef: { typeParams, params, returnType },
      },
      i,
    ) => {
      const id = nameToId("overload", String(i));
      const tags = [];
      if (isDeprecated({ jsDoc })) {
        tags.push(<Tag color="gray">deprecated</Tag>);
      }
      // TODO(@kitsonk) suppress defs with bodies when !isSingle when property
      // available.
      return (
        <div class={style("docItem")} id={id}>
          <Anchor>{id}</Anchor>
          <DocEntry location={location}>
            {name}
            <TypeParams {...markdownContext}>{typeParams}</TypeParams>(<Params
              inline
              {...markdownContext}
            >
              {params}
            </Params>){returnType && (
              <>
                : <TypeDef {...markdownContext}>{returnType}</TypeDef>
              </>
            )}
            {tags}
          </DocEntry>
          {maybe(
            !isSingle,
            <JsDoc
              tagKinds={["param", "return", "template", "deprecated"]}
              tagsWithDoc
              {...markdownContext}
            >
              {jsDoc}
            </JsDoc>,
          )}
        </div>
      );
    },
  );
  return <div class={style("docBlockItems")}>{items}</div>;
}
