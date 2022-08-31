// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  apply,
  css,
  type DocNodeFunction,
  FunctionDef,
  JsDocTagParam,
  JsDocTagReturn,
  tw,
} from "../deps.ts";
import { Anchor, DocEntry, nameToId, Section, Tag } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import {
  getSummary,
  Markdown,
  MarkdownContext,
  MarkdownSummary,
} from "./markdown.tsx";
import { DocParamDef, Params } from "./params.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { DocTypeParams, TypeDef } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

export function DocFunctionSummary({
  children,
}: {
  children: Child<FunctionDef>;
}) {
  const def = take(children, true);

  return (
    <>
      <DocTypeParams>{def.typeParams}</DocTypeParams>
      (
      <Params>
        {def.params}
      </Params>
      )
      {def.returnType && (
        <span>
          : <TypeDef>{def.returnType}</TypeDef>
        </span>
      )}
    </>
  );
}

function DocBlockShortFunction({
  children,
  i,
}: {
  children: Child<DocNodeFunction>;
  i: number;
}) {
  const def = take(children, true);

  if (def.functionDef.hasBody) {
    return <></>;
  }

  const overloadId = nameToId("function_overload", `${i}_${def.name}`);
  const summary = getSummary(def.jsDoc?.doc);

  return (
    <label
      htmlFor={overloadId}
      class={tw`block p-4 rounded-lg border border-[#DDDDDD] hover:bg-ultralight cursor-pointer`}
    >
      <div class={tw`font-mono`}>
        <span class={tw`font-bold`}>{def.name}</span>
        <span class={tw`font-medium`}>
          <DocFunctionSummary>{def.functionDef}</DocFunctionSummary>
        </span>
      </div>

      <div class={tw`w-full`}>
        <MarkdownSummary url={""}>{summary}</MarkdownSummary>
      </div>
    </label>
  );
}

export function DocBlockFunction(
  { children, ...markdownContext }:
    & { children: Child<DocNodeFunction[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);

  const items = defs.map(
    (
      {
        location,
        name,
        jsDoc,
        functionDef,
      },
      i,
    ) => {
      const overloadId = nameToId("function_overload", `${i}_${name}`);
      const tags = [];
      if (isDeprecated({ jsDoc })) {
        tags.push(<Tag color="gray">deprecated</Tag>);
      }

      const paramDocs: JsDocTagParam[] =
        (jsDoc?.tags?.filter(({ kind }) =>
          kind === "param"
        ) as JsDocTagParam[]) ?? [];

      const returnDoc = jsDoc?.tags?.find(({ kind }) =>
        kind === "return"
      ) as (JsDocTagReturn | undefined);

      const parameters = functionDef.params.map((param, j) => {
        const doc = paramDocs[j]?.doc;
        const id = nameToId(
          "function_overload",
          `${i}_${name}_parameters_${j}`,
        );

        return (
          <div class={style("docItem")} id={id}>
            <Anchor>{id}</Anchor>
            <DocParamDef location={location}>{param}</DocParamDef>
            {doc && <Markdown {...markdownContext}>{doc}</Markdown>}
          </div>
        );
      });

      return (
        <div class={style("docBlockItems")} id={overloadId + "_div"}>
          <JsDoc {...markdownContext}>
            {jsDoc}
          </JsDoc>

          <Section title="Parameters">{parameters}</Section>

          {functionDef.returnType && (
            <Section title="Returns">
              {[
                <div class={style("docItem")} id={"id"}>
                  <Anchor>{"id"}</Anchor>
                  <DocEntry location={location} name={""}>
                    <TypeDef>{functionDef.returnType}</TypeDef>
                  </DocEntry>
                  {returnDoc?.doc && (
                    <Markdown {...markdownContext}>{returnDoc?.doc}</Markdown>
                  )}
                </div>,
              ]}
            </Section>
          )}
        </div>
      );
    },
  );

  return (
    <div class={style("docBlockItems")}>
      {defs.length !== 1 && (
        <>
          {defs.map((def, i) => {
            const id = nameToId("function_overload", def.name);
            const overloadId = nameToId(
              "function_overload",
              `${i}_${def.name}`,
            );

            return (
              <input
                type="radio"
                name={id}
                id={overloadId}
                class={tw`hidden ${
                  css({
                    [`&:checked ~ *:last-child > :not(#${overloadId}_div)`]:
                      apply`hidden`,
                    [`&:checked ~ div:first-of-type > label[for='${overloadId}']`]:
                      apply`bg-gray-200`,
                  })
                }`}
                checked={i === 0}
              />
            );
          })}

          <div class={tw`space-y-4`}>
            {defs.map((def, i) => (
              <DocBlockShortFunction i={i}>{def}</DocBlockShortFunction>
            ))}
          </div>
        </>
      )}

      <div>
        {items}
      </div>
    </div>
  );
}
