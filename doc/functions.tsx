// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  apply,
  css,
  type DocNodeFunction,
  type FunctionDef,
  type JsDocTagParam,
  type JsDocTagReturn,
  tw,
} from "../deps.ts";
import {
  Anchor,
  DocEntry,
  nameToId,
  Section,
  tagVariants,
} from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import {
  getSummary,
  Markdown,
  type MarkdownContext,
  MarkdownSummary,
} from "./markdown.tsx";
import { DocParamDef, Params } from "./params.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { DocTypeParams, TypeDef } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

export function DocFunctionSummary({
  children,
  ...markdownContext
}: {
  children: Child<FunctionDef>;
} & MarkdownContext) {
  const def = take(children, true);

  return (
    <>
      <DocTypeParams {...markdownContext}>{def.typeParams}</DocTypeParams>
      (
      <Params {...markdownContext}>
        {def.params}
      </Params>
      )
      {def.returnType && (
        <span>
          : <TypeDef {...markdownContext}>{def.returnType}</TypeDef>
        </span>
      )}
    </>
  );
}

function DocFunctionOverload({
  children,
  i,
  ...markdownContext
}: {
  children: Child<DocNodeFunction>;
  i: number;
} & MarkdownContext) {
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
          <DocFunctionSummary {...markdownContext}>
            {def.functionDef}
          </DocFunctionSummary>
        </span>
      </div>

      <div class={tw`w-full`}>
        <MarkdownSummary {...markdownContext}>{summary}</MarkdownSummary>
      </div>
    </label>
  );
}

function DocFunction(
  { children, n, ...markdownContext }:
    & { children: Child<DocNodeFunction>; n: number }
    & MarkdownContext,
) {
  const def = take(children);

  const overloadId = nameToId("function_overload", `${n}_${def.name}`);
  const tags = [];
  if (isDeprecated(def)) {
    tags.push(tagVariants.deprecated());
  }

  const paramDocs: JsDocTagParam[] =
    (def.jsDoc?.tags?.filter(({ kind }) =>
      kind === "param"
    ) as JsDocTagParam[]) ??
      [];

  const returnDoc = def.jsDoc?.tags?.find(({ kind }) =>
    kind === "return"
  ) as (JsDocTagReturn | undefined);

  const parameters = def.functionDef.params.map((param, i) => {
    const doc = paramDocs[i]?.doc;
    const id = nameToId(
      "function_overload",
      `${n}_${def.name}_parameters_${i}`,
    );

    return (
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocParamDef location={def.location} {...markdownContext}>
          {param}
        </DocParamDef>
        {doc && <Markdown {...markdownContext}>{doc}</Markdown>}
      </div>
    );
  });

  return (
    <div class={style("docBlockItems")} id={overloadId + "_div"}>
      <JsDoc {...markdownContext}>{def.jsDoc}</JsDoc>

      <Section title="Parameters">{parameters}</Section>

      {def.functionDef.returnType && (
        <Section title="Returns">
          {[
            <div class={style("docItem")} id={"id"}>
              <Anchor>{"id"}</Anchor>
              <DocEntry location={def.location} tags={tags} name={""}>
                <TypeDef {...markdownContext}>
                  {def.functionDef.returnType}
                </TypeDef>
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
}

export function DocBlockFunction(
  { children, ...markdownContext }:
    & { children: Child<DocNodeFunction[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);

  const items = defs.map((def, i) => (
    <DocFunction n={i} {...markdownContext}>{def}</DocFunction>
  ));

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
              <DocFunctionOverload i={i} {...markdownContext}>
                {def}
              </DocFunctionOverload>
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
