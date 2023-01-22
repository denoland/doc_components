// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

import {
  type ClassIndexSignatureDef,
  type DocNodeInterface,
  type InterfaceCallSignatureDef,
  type InterfaceIndexSignatureDef,
  type InterfaceMethodDef,
  type InterfacePropertyDef,
  type JsDocTagValued,
} from "../deps.ts";
import {
  Anchor,
  DocEntry,
  Examples,
  nameToId,
  Section,
  Tag,
  tagVariants,
} from "./doc_common.tsx";
import { Context } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { style } from "../styles.ts";
import { DocTypeParamsSummary, TypeDef, TypeParamsDoc } from "./types.tsx";
import { type Child, isDeprecated, maybe, take } from "./utils.ts";

type IndexSignatureDef =
  | ClassIndexSignatureDef
  | InterfaceIndexSignatureDef;

function CallSignaturesDoc(
  { children, context }: {
    children: Child<InterfaceCallSignatureDef[]>;
    context: Context;
  },
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
        tags.push(tagVariants.deprecated());
      }
      return (
        <DocEntry
          id={id}
          location={location}
          tags={tags}
          jsDoc={jsDoc}
          context={context}
        >
          <DocTypeParamsSummary context={context}>
            {typeParams}
          </DocTypeParamsSummary>(<Params context={context}>
            {params}
          </Params>){tsType && (
            <>
              :{" "}
              <TypeDef context={context}>
                {tsType}
              </TypeDef>
            </>
          )}
        </DocEntry>
      );
    },
  );
  return <Section title="Call Signatures">{items}</Section>;
}

export function IndexSignaturesDoc(
  { children, context }: {
    children: Child<IndexSignatureDef[]>;
    context: Context;
  },
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
          <span>readonly{" "}</span>,
        )}[<Params context={context}>
          {params}
        </Params>]{tsType && (
          <span>
            :{" "}
            <TypeDef context={context}>
              {tsType}
            </TypeDef>
          </span>
        )}
      </div>
    );
  });

  return <Section title="Index Signatures">{items}</Section>;
}

function MethodsDoc(
  { children, context }: {
    children: Child<InterfaceMethodDef[]>;
    context: Context;
  },
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
      if (optional) {
        tags.push(tagVariants.optional());
      }
      if (isDeprecated({ jsDoc })) {
        tags.push(tagVariants.deprecated());
      }

      return (
        <DocEntry
          id={id}
          location={location}
          tags={tags}
          name={name === "new"
            ? <span>new</span>
            : computed
            ? `[${name}]`
            : name}
          jsDoc={jsDoc}
          context={context}
        >
          <DocTypeParamsSummary context={context}>
            {typeParams}
          </DocTypeParamsSummary>
          (<Params context={context}>
            {params}
          </Params>)
          {returnType && (
            <span>
              :{" "}
              <TypeDef context={context}>
                {returnType}
              </TypeDef>
            </span>
          )}
        </DocEntry>
      );
    },
  );
  return <Section title="Methods">{items}</Section>;
}

function PropertiesDoc(
  { children, context }: {
    children: Child<InterfacePropertyDef[]>;
    context: Context;
  },
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
        tags.push(tagVariants.readonly());
      }
      if (optional) {
        tags.push(tagVariants.optional());
      }
      if (isDeprecated({ jsDoc })) {
        tags.push(tagVariants.deprecated());
      }

      const defaultValue =
        (jsDoc?.tags?.find(({ kind }) => kind === "default") as
          | JsDocTagValued
          | undefined)?.value;

      return (
        <DocEntry
          id={id}
          location={location}
          tags={tags}
          name={maybe(computed, `[${name}]`, name)}
          jsDoc={jsDoc}
          context={context}
        >
          {tsType && (
            <>
              :{" "}
              <TypeDef context={context}>
                {tsType}
              </TypeDef>
            </>
          )}
          {defaultValue && (
            <span>
              <span class="font-normal">{" = "}</span>
              {defaultValue}
            </span>
          )}
        </DocEntry>
      );
    },
  );

  return <Section title="Properties">{items}</Section>;
}

export function DocSubTitleInterface(
  { children, context }: {
    children: Child<DocNodeInterface>;
    context: Context;
  },
) {
  const { interfaceDef } = take(children);

  if (interfaceDef.extends.length === 0) {
    return <></>;
  }

  return (
    <div>
      <span class="text-[#9CA0AA] italic">{" implements "}</span>
      {interfaceDef.extends.map((typeDef, i) => (
        <>
          <TypeDef context={context}>
            {typeDef}
          </TypeDef>
          {i !== (interfaceDef.extends.length - 1) && <span>,{" "}</span>}
        </>
      ))}
    </div>
  );
}

export function DocBlockInterface(
  { children, context }: {
    children: Child<DocNodeInterface>;
    context: Context;
  },
) {
  const def = take(children);
  context.typeParams = def.interfaceDef.typeParams.map(({ name }) => name);
  return (
    <div class={style("docBlockItems")}>
      <Examples context={context}>{def.jsDoc}</Examples>

      <TypeParamsDoc base={def} context={context}>
        {def.interfaceDef.typeParams}
      </TypeParamsDoc>

      <IndexSignaturesDoc context={context}>
        {def.interfaceDef.indexSignatures}
      </IndexSignaturesDoc>

      <CallSignaturesDoc context={context}>
        {def.interfaceDef.callSignatures}
      </CallSignaturesDoc>

      <PropertiesDoc context={context}>
        {def.interfaceDef.properties}
      </PropertiesDoc>

      <MethodsDoc context={context}>
        {def.interfaceDef.methods}
      </MethodsDoc>
    </div>
  );
}
