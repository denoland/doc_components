// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  type ClassIndexSignatureDef, DocNodeClass,
  type DocNodeInterface,
  type InterfaceCallSignatureDef,
  type InterfaceIndexSignatureDef,
  type InterfaceMethodDef,
  type InterfacePropertyDef,
  type Location,
  type TsTypeDef, tw,
} from "../deps.ts";
import {
  Anchor,
  DocEntry, getAccessibilityTag,
  nameToId,
  SectionTitle,
  Tag,
} from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { MarkdownContext } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { DocTypeParams, TypeDef, TypeParams } from "./types.tsx";
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
          <DocEntry location={location}>
            <TypeParams {...markdownContext}>{typeParams}</TypeParams>(<Params
            inline
            {...markdownContext}
          >
            {params}
          </Params>){tsType && (
            <>
              : <TypeDef inline {...markdownContext}>{tsType}</TypeDef>
            </>
          )}
            {tags}
          </DocEntry>
          <JsDoc tagKinds={["deprecated"]} tagsWithDoc {...markdownContext}>
            {jsDoc}
          </JsDoc>
        </div>
      );
    },
  );
  return (
    <>
      <SectionTitle>Call Signatures</SectionTitle>
      {items}
    </>
  );
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
            : <TypeDef inline {...markdownContext}>{tsType}</TypeDef>
          </span>
      )}
      </div>
    );
  });
  return (
    <div>
      <SectionTitle>Index Signatures</SectionTitle>
      {items}
    </div>
  );
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
        tags.push(<Tag color="purple">{kind}</Tag>); // TODO
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
          <DocEntry location={location} tags={tags} name={name === "new"
            ? <span class={style("keyword")}>new</span>
            : computed
              ? `[${name}]`
              : name}>
            <DocTypeParams {...markdownContext}>{typeParams}</DocTypeParams>
            (
            <Params
              inline
              {...markdownContext}
            >
              {params}
            </Params>
            )
            {returnType && (
              <span>
              : <TypeDef {...markdownContext}>{returnType}</TypeDef>
            </span>
            )}
          </DocEntry>
          <JsDoc
            tagKinds={["param", "return", "template", "deprecated"]}
            tagsWithDoc
            {...markdownContext}
          >
            {jsDoc}
          </JsDoc>
        </div>
      );
    },
  );
  return (
    <div>
      <SectionTitle>Methods</SectionTitle>
      <div class={tw`mt-2 space-y-3`}>
        {items}
      </div>
    </div>
  );
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
          <DocEntry location={location} tags={tags} name={maybe(computed, `[${name}]`, name)}>
            {tsType && (
              <>
                : <TypeDef inline {...markdownContext}>{tsType}</TypeDef>
              </>
            )}
          </DocEntry>
          <JsDoc tagKinds={["deprecated"]} tagsWithDoc {...markdownContext}>
            {jsDoc}
          </JsDoc>
        </div>
      );
    },
  );

  return (
    <div>
      <SectionTitle>Properties</SectionTitle>
      <div class={tw`mt-2 space-y-3`}>
        {items}
      </div>
    </div>
  );
}

export function DocTitleInterface({ children }: { children: Child<DocNodeInterface> }) {
  const { interfaceDef } = take(children);

  return (
    <>
      <DocTypeParams>{interfaceDef.typeParams}</DocTypeParams>

      {interfaceDef.extends.length !== 0 && (
        <span>
          <span class={tw`text-[#9CA0AA] italic`}>{" implements "}</span>
          {interfaceDef.extends.map((typeDef, i) => (
            <>
              <TypeDef>{typeDef}</TypeDef>
              {i !== (interfaceDef.extends.length - 1) && <span>,{" "}</span>}
            </>
          ))}
        </span>
      )}
    </>
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
