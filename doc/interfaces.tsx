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
import {
  Anchor,
  DocEntry,
  nameToId,
  Section,
  Tag,
  tagVariants,
} from "./doc_common.tsx";
import { MarkdownContext } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { DocTypeParamsSummary, TypeDef, TypeParamsDoc } from "./types.tsx";
import { type Child, isDeprecated, maybe, take } from "./utils.ts";

type IndexSignatureDef =
  | ClassIndexSignatureDef
  | InterfaceIndexSignatureDef;

function CallSignaturesDoc(
  { children, typeParams, markdownContext }: {
    children: Child<InterfaceCallSignatureDef[]>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map(
    ({ typeParams: localTypeParams, params, tsType, jsDoc, location }, i) => {
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
          markdownContext={markdownContext}
        >
          <DocTypeParamsSummary
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {localTypeParams}
          </DocTypeParamsSummary>(<Params
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {params}
          </Params>){tsType && (
            <>
              :{" "}
              <TypeDef
                typeParams={typeParams}
                markdownContext={markdownContext}
              >
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
  { children, typeParams, markdownContext }: {
    children: Child<IndexSignatureDef[]>;
    typeParams: string[];
    markdownContext: MarkdownContext;
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
        )}[<Params typeParams={typeParams} markdownContext={markdownContext}>
          {params}
        </Params>]{tsType && (
          <span>
            :{" "}
            <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
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
  { children, typeParams, markdownContext }: {
    children: Child<InterfaceMethodDef[]>;
    typeParams: string[];
    markdownContext: MarkdownContext;
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
        typeParams: localTypeParams,
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
          markdownContext={markdownContext}
        >
          <DocTypeParamsSummary
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {localTypeParams}
          </DocTypeParamsSummary>
          (<Params typeParams={typeParams} markdownContext={markdownContext}>
            {params}
          </Params>)
          {returnType && (
            <span>
              :{" "}
              <TypeDef
                typeParams={typeParams}
                markdownContext={markdownContext}
              >
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
  { children, typeParams, markdownContext }: {
    children: Child<InterfacePropertyDef[]>;
    typeParams: string[];
    markdownContext: MarkdownContext;
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

      return (
        <DocEntry
          id={id}
          location={location}
          tags={tags}
          name={maybe(computed, `[${name}]`, name)}
          jsDoc={jsDoc}
          markdownContext={markdownContext}
        >
          {tsType && (
            <>
              :{" "}
              <TypeDef
                typeParams={typeParams}
                markdownContext={markdownContext}
              >
                {tsType}
              </TypeDef>
            </>
          )}
        </DocEntry>
      );
    },
  );

  return <Section title="Properties">{items}</Section>;
}

export function DocSubTitleInterface(
  { children, typeParams, markdownContext }: {
    children: Child<DocNodeInterface>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
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
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {typeDef}
          </TypeDef>
          {i !== (interfaceDef.extends.length - 1) && <span>,{" "}</span>}
        </>
      ))}
    </div>
  );
}

export function DocBlockInterface(
  { children, markdownContext }: {
    children: Child<DocNodeInterface>;
    markdownContext: MarkdownContext;
  },
) {
  const def = take(children);
  const typeParams = def.interfaceDef.typeParams.map(({ name }) => name);
  return (
    <div class={style("docBlockItems")}>
      <TypeParamsDoc
        typeParams={typeParams}
        base={def}
        markdownContext={markdownContext}
      >
        {def.interfaceDef.typeParams}
      </TypeParamsDoc>

      <IndexSignaturesDoc
        typeParams={typeParams}
        markdownContext={markdownContext}
      >
        {def.interfaceDef.indexSignatures}
      </IndexSignaturesDoc>

      <CallSignaturesDoc
        typeParams={typeParams}
        markdownContext={markdownContext}
      >
        {def.interfaceDef.callSignatures}
      </CallSignaturesDoc>

      <PropertiesDoc typeParams={typeParams} markdownContext={markdownContext}>
        {def.interfaceDef.properties}
      </PropertiesDoc>

      <MethodsDoc typeParams={typeParams} markdownContext={markdownContext}>
        {def.interfaceDef.methods}
      </MethodsDoc>
    </div>
  );
}
