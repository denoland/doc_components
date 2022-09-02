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
import { DocEntry, nameToId, Section, tagVariants } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import {
  getSummary,
  type MarkdownContext,
  MarkdownSummary,
} from "./markdown.tsx";
import { paramName, Params } from "./params.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { DocTypeParams, TypeDef } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

export function DocFunctionSummary({
  children,
  markdownContext,
}: {
  children: Child<FunctionDef>;
  markdownContext: MarkdownContext;
}) {
  const def = take(children, true);

  return (
    <>
      <DocTypeParams markdownContext={markdownContext}>
        {def.typeParams}
      </DocTypeParams>
      (
      <Params markdownContext={markdownContext}>
        {def.params}
      </Params>
      )
      {def.returnType && (
        <span>
          :{" "}
          <TypeDef markdownContext={markdownContext}>{def.returnType}</TypeDef>
        </span>
      )}
    </>
  );
}

function DocFunctionOverload({
  children,
  i,
  markdownContext,
}: {
  children: Child<DocNodeFunction>;
  i: number;
  markdownContext: MarkdownContext;
}) {
  const def = take(children, true);

  if (def.functionDef.hasBody) {
    return <></>;
  }

  const overloadId = nameToId("function", `${def.name}_${i}`);
  const summary = getSummary(def.jsDoc?.doc);

  return (
    <label
      htmlFor={overloadId}
      class={tw`block p-4 rounded-lg border border-[#DDDDDD] hover:bg-ultralight cursor-pointer`}
    >
      <div class={tw`font-mono`}>
        <span class={tw`font-bold`}>{def.name}</span>
        <span class={tw`font-medium`}>
          <DocFunctionSummary markdownContext={markdownContext}>
            {def.functionDef}
          </DocFunctionSummary>
        </span>
      </div>

      <div class={tw`w-full`}>
        <MarkdownSummary markdownContext={markdownContext}>
          {summary}
        </MarkdownSummary>
      </div>
    </label>
  );
}

function DocFunction(
  { children, n, markdownContext }: {
    children: Child<DocNodeFunction>;
    n: number;
    markdownContext: MarkdownContext;
  },
) {
  const def = take(children);

  const overloadId = nameToId("function", `${def.name}_${n}`);
  const tags = [];

  if (isDeprecated(def)) {
    tags.push(tagVariants.deprecated());
  }

  const paramDocs: JsDocTagParam[] =
    (def.jsDoc?.tags?.filter(({ kind }) =>
      kind === "param"
    ) as JsDocTagParam[]) ??
      [];

  const parameters = def.functionDef.params.map((param, i) => {
    const id = nameToId("function", `${def.name}_${n}_parameters_${i}`);
    const name = paramName(param);

    return (
      <DocEntry
        id={id}
        location={def.location}
        name={name}
        jsDoc={paramDocs[i]}
        markdownContext={markdownContext}
      >
        {param.tsType && (
          <span>
            :{" "}
            <TypeDef markdownContext={markdownContext}>{param.tsType}</TypeDef>
          </span>
        )}
      </DocEntry>
    );
  });

  const returnDoc = def.jsDoc?.tags?.find(({ kind }) =>
    kind === "return"
  ) as (JsDocTagReturn | undefined);
  const returnId = nameToId("function", `${def.name}_${n}_return`);

  return (
    <div class={style("docBlockItems")} id={overloadId + "_div"}>
      <JsDoc markdownContext={markdownContext}>{def.jsDoc}</JsDoc>

      <Section title="Parameters">{parameters}</Section>

      {def.functionDef.returnType && (
        <Section title="Returns">
          {[
            <DocEntry
              id={returnId}
              location={def.location}
              jsDoc={returnDoc}
              markdownContext={markdownContext}
            >
              <TypeDef markdownContext={markdownContext}>
                {def.functionDef.returnType}
              </TypeDef>
            </DocEntry>,
          ]}
        </Section>
      )}
    </div>
  );
}

export function DocBlockFunction(
  { children, markdownContext }: {
    children: Child<DocNodeFunction[]>;
    markdownContext: MarkdownContext;
  },
) {
  const defs = take(children, true);

  const items = defs.map((def, i) => (
    <DocFunction n={i} markdownContext={markdownContext}>{def}</DocFunction>
  ));

  return (
    <div class={style("docBlockItems")}>
      {defs.length !== 1 && (
        <>
          {defs.map((def, i) => {
            const id = nameToId("function", def.name);
            const overloadId = nameToId("function", `${def.name}_${i}`);

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
                      apply`bg-[#056CF00C] border-[#056CF0] border-2`,
                  })
                }`}
                checked={i === 0}
              />
            );
          })}
          <div class={tw`space-y-2`}>
            {defs.map((def, i) => (
              <DocFunctionOverload i={i} markdownContext={markdownContext}>
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
