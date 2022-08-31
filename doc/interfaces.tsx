// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  type ClassIndexSignatureDef,
  type DocNodeInterface,
  type InterfaceCallSignatureDef,
  type InterfaceIndexSignatureDef,
  type InterfaceMethodDef,
  type InterfacePropertyDef,
  tw,
} from "../deps.ts";
import { Anchor, DocEntry, nameToId, Section, Tag } from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { MarkdownContext } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { DocTypeParams, TypeDef } from "./types.tsx";
import { type Child, isDeprecated, maybe, take } from "./utils.ts";

type IndexSignatureDef =
  | ClassIndexSignatureDef
  | InterfaceIndexSignatureDef;

function CallSignaturesDoc(
  { children, ...markdownContext }: {
    children: Child<InterfaceCallSignatureDef[]>;
  } & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map(
    ({ typeParams, params, tsType, jsDoc, location }, i) => {
      const id = nameToId("call_sig", String(i));
      const tags = [];
      if (isDeprecated({ jsDoc })) {
        tags.push(<Tag color="gray">deprecated</Tag>);
      }
      return (
        <div class={style("docItem")} id={id}>
          <Anchor>{id}</Anchor>
          <DocEntry location={location} name={""}>
            <DocTypeParams {...markdownContext}>{typeParams}
            </DocTypeParams>(<Params {...markdownContext}>
              {params}
            </Params>){tsType && (
              <>
                : <TypeDef {...markdownContext}>{tsType}</TypeDef>
              </>
            )}
            {tags}
          </DocEntry>
          <JsDoc {...markdownContext}>{jsDoc}</JsDoc>
        </div>
      );
    },
  );
  return <Section title="Call Signatures">{items}</Section>;
}

export function IndexSignaturesDoc(
  { children, ...markdownContext }:
    & { children: Child<IndexSignatureDef[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map(({ readonly, params, tsType }, i) => {
    const id = nameToId("index_sig", String(i));
    return (
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        {maybe(
          readonly,
          <span class={style("keyword")}>readonly{" "}</span>,
        )}[<Params {...markdownContext}>{params}</Params>]{tsType && (
          <span>
            : <TypeDef {...markdownContext}>{tsType}</TypeDef>
          </span>
        )}
      </div>
    );
  });

  return <Section title="Index Signatures">{items}</Section>;
}

function MethodsDoc(
  { children, ...markdownContext }:
    & { children: Child<InterfaceMethodDef[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map(
    (
      {
        name,
        kind,
        location,
        jsDoc,
        computed,
        optional,
        params,
        returnType,
        typeParams,
      },
      i,
    ) => {
      const id = nameToId("method", `${name}_${i}`);
      const tags = [];
      if (kind !== "method") {
        tags.push(<Tag color="purple">{kind}</Tag>);
      }
      /*if (optional) {
        tags.push(<Tag color="cyan">optional</Tag>);
      }*/
      if (isDeprecated({ jsDoc })) {
        tags.push(<Tag color="gray">deprecated</Tag>);
      }

      return (
        <div class={style("docItem")} id={id}>
          <Anchor>{id}</Anchor>
          <DocEntry
            location={location}
            tags={tags}
            name={name === "new"
              ? <span class={style("keyword")}>new</span>
              : computed
              ? `[${name}]`
              : name}
          >
            <DocTypeParams {...markdownContext}>{typeParams}</DocTypeParams>
            (
            <Params {...markdownContext}>
              {params}
            </Params>
            )
            {returnType && (
              <span>
                : <TypeDef {...markdownContext}>{returnType}</TypeDef>
              </span>
            )}
          </DocEntry>
          <JsDoc {...markdownContext}>{jsDoc}</JsDoc>
        </div>
      );
    },
  );
  return <Section title="Methods">{items}</Section>;
}

function PropertiesDoc(
  { children, ...markdownContext }:
    & { children: Child<InterfacePropertyDef[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map(
    (
      {
        name,
        location,
        jsDoc,
        readonly,
        computed,
        optional,
        tsType,
      },
    ) => {
      const id = nameToId("prop", name);
      const tags = [];
      if (readonly) {
        tags.push(<Tag color="purple">readonly</Tag>);
      }
      if (optional) {
        tags.push(<Tag color="cyan">optional</Tag>);
      }
      if (isDeprecated({ jsDoc })) {
        tags.push(<Tag color="gray">deprecated</Tag>);
      }

      return (
        <div class={style("docItem")} id={id}>
          <Anchor>{id}</Anchor>
          <DocEntry
            location={location}
            tags={tags}
            name={maybe(computed, `[${name}]`, name)}
          >
            {tsType && (
              <>
                : <TypeDef {...markdownContext}>{tsType}</TypeDef>
              </>
            )}
          </DocEntry>
          <JsDoc {...markdownContext}>{jsDoc}</JsDoc>
        </div>
      );
    },
  );

  return <Section title="Properties">{items}</Section>;
}

export function DocSubTitleInterface(
  { children, ...markdownContext }:
    & { children: Child<DocNodeInterface> }
    & MarkdownContext,
) {
  const { interfaceDef } = take(children);

  if (interfaceDef.extends.length === 0) {
    return <></>;
  }

  return (
    <div>
      <span class={tw`text-[#9CA0AA] italic`}>{" implements "}</span>
      {interfaceDef.extends.map((typeDef, i) => (
        <>
          <TypeDef {...markdownContext}>{typeDef}</TypeDef>
          {i !== (interfaceDef.extends.length - 1) && <span>,{" "}</span>}
        </>
      ))}
    </div>
  );
}

export function DocBlockInterface(
  { children, ...markdownContext }:
    & { children: Child<DocNodeInterface> }
    & MarkdownContext,
) {
  const {
    interfaceDef: {
      indexSignatures,
      callSignatures,
      properties,
      methods,
    },
  } = take(children);
  return (
    <div class={style("docBlockItems")}>
      <IndexSignaturesDoc {...markdownContext}>
        {indexSignatures}
      </IndexSignaturesDoc>

      <CallSignaturesDoc {...markdownContext}>
        {callSignatures}
      </CallSignaturesDoc>

      <PropertiesDoc {...markdownContext}>{properties}</PropertiesDoc>

      <MethodsDoc {...markdownContext}>{methods}</MethodsDoc>
    </div>
  );
}
