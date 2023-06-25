// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

import {
  apply,
  css,
  type DocNodeFunction,
  type FunctionDef,
  type JsDocTagParam,
  type JsDocTagReturn,
  type JsDocTagValued,
  tw,
} from "../deps.ts";
import {
  DocEntry,
  Examples,
  nameToId,
  Section,
  tagVariants,
} from "./doc_common.tsx";
import { type Context, JsDoc, Markdown } from "./markdown.tsx";
import { paramName, Params } from "./params.tsx";
import { style } from "../styles.ts";
import { DocTypeParamsSummary, TypeDef, TypeParamsDoc } from "./types.tsx";
import { type Child, isDeprecated, take } from "./utils.ts";

export function DocFunctionSummary({
  children,
  context,
}: {
  children: Child<FunctionDef>;
  context: Context;
}) {
  const def = take(children, true);

  return (
    <>
      <DocTypeParamsSummary context={context}>
        {def.typeParams}
      </DocTypeParamsSummary>
      (
      <Params context={context}>
        {def.params}
      </Params>
      )
      {def.returnType && (
        <span>
          :{" "}
          <TypeDef context={context}>
            {def.returnType}
          </TypeDef>
        </span>
      )}
    </>
  );
}

function DocFunctionOverload({
  children,
  i,
  context,
}: {
  children: Child<DocNodeFunction>;
  i: number;
  context: Context;
}) {
  const def = take(children, true);

  if (def.functionDef.hasBody && i !== 0) {
    return <></>;
  }

  context.typeParams = def.functionDef.typeParams.map(({ name }) => name);
  const overloadId = nameToId("function", `${def.name}_${i}`);

  return (
    <label
      htmlFor={overloadId}
      class="block p-4 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
    >
      <div>
        <div class="font-mono">
          <span class="font-bold">{def.name}</span>
          <span class="font-medium">
            <DocFunctionSummary context={context}>
              {def.functionDef}
            </DocFunctionSummary>
          </span>
        </div>

        {!(def.functionDef.hasBody && i === 0) && (
          <div class="w-full">
            <Markdown summary context={context}>
              {def.jsDoc?.doc}
            </Markdown>
          </div>
        )}
      </div>
    </label>
  );
}

function DocFunction(
  { children, n, context }: {
    children: Child<DocNodeFunction>;
    n: number;
    context: Context;
  },
) {
  const def = take(children);
  context.typeParams = def.functionDef.typeParams.map(({ name }) => name);

  const overloadId = nameToId("function", `${def.name}_${n}`);
  const tags = [];

  if (isDeprecated(def)) {
    tags.push(tagVariants.deprecated());
  }

  const paramDocs: JsDocTagParam[] =
    (def.jsDoc?.tags?.filter(({ kind }) => kind === "param") as
      | JsDocTagParam[]
      | undefined) ??
      [];

  const parameters = def.functionDef.params.map((param, i) => {
    const name = paramName(param, i);
    const id = nameToId("function", `${def.name}_${n}_parameters_${name}`);

    const defaultValue = ((def.jsDoc?.tags?.find(({ kind }) =>
      kind === "default"
    ) as JsDocTagValued | undefined)?.value) ??
      (param.kind === "assign" ? param.right : undefined);

    const type = param.kind === "assign" ? param.left.tsType : param.tsType;

    const tags = [];
    if (("optional" in param && param.optional) || defaultValue) {
      tags.push(tagVariants.optional());
    }

    return (
      <DocEntry
        id={id}
        location={def.location}
        name={name}
        tags={tags}
        jsDoc={paramDocs[i]}
        context={context}
      >
        {type && (
          <span>
            :{" "}
            <TypeDef context={context}>
              {type}
            </TypeDef>
          </span>
        )}
        {defaultValue && (
          <span>
            <span class="font-normal">{" = "}</span>
            {defaultValue}
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
      <JsDoc context={context}>{def.jsDoc}</JsDoc>

      <Examples context={context}>{def.jsDoc}</Examples>

      <TypeParamsDoc base={def} context={context}>
        {def.functionDef.typeParams}
      </TypeParamsDoc>

      <Section title="Parameters">{parameters}</Section>

      {def.functionDef.returnType && (
        <Section title="Returns">
          {[
            <DocEntry
              id={returnId}
              location={def.location}
              jsDoc={returnDoc}
              context={context}
            >
              <TypeDef
                context={context}
              >
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
  { children, context }: {
    children: Child<DocNodeFunction[]>;
    context: Context;
  },
) {
  const defs = take(children, true);

  const items = defs.map((def, i) => {
    if (def.functionDef.hasBody && i !== 0) {
      return <></>;
    }

    return <DocFunction n={i} context={context}>{def}</DocFunction>;
  });

  return (
    <div class={style("docBlockItems")}>
      {defs.map((def, i) => {
        if (def.functionDef.hasBody && i !== 0) {
          return <></>;
        }

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
                  apply`bg-[#056CF00C] border-blue-600 border-2 cursor-unset`,
                [`&:checked ~ div:first-of-type > label[for='${overloadId}'] > div`]:
                  apply`-m-px`,
              })
            }`}
            checked={i === 0}
          />
        );
      })}
      <div class="space-y-2">
        {defs.map((def, i) => (
          <DocFunctionOverload i={i} context={context}>
            {def}
          </DocFunctionOverload>
        ))}
      </div>

      <div>{items}</div>
    </div>
  );
}
