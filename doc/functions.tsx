// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeFunction, tw } from "../deps.ts";
import { Anchor, DocEntry, nameToId, Tag } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { MarkdownContext } from "./markdown.tsx";
import { DocParamDef, Params } from "./params.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { DocTypeParams, TypeDef } from "./types.tsx";
import { type Child, isDeprecated, maybe, take } from "./utils.ts";

export function DocTitleFn(
  { children }: { children: Child<DocNodeFunction[]> },
) {
  const [{ functionDef }] = take(children, true);

  return (
    <>
      <DocTypeParams>{functionDef.typeParams}</DocTypeParams>
    </>
  );
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
          <DocEntry location={location} name={name} tags={tags}>
            <DocParamDef location={location}>{params}</DocParamDef>

            {returnType && (
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

  return (
    <div class={style("docBlockItems")}>
      {items}
    </div>
  );
}
