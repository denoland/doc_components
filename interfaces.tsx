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
  type Location,
  type TsTypeDef,
} from "./deps.ts";
import {
  Anchor,
  DocEntry,
  nameToId,
  SectionTitle,
  Tag,
} from "./doc_common.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { MarkdownContext } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { DocTypeParams, TypeDef, TypeParams } from "./types.tsx";
import { type Child, isDeprecated, maybe, take } from "./utils.ts";

type IndexSignatureDef =
  | ClassIndexSignatureDef
  | InterfaceIndexSignatureDef;

function CallSignatures(
  { children, ...props }: {
    children: Child<InterfaceCallSignatureDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const items = signatures.map(({ typeParams, params, tsType }) => (
    <div>
      <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
        {params}
      </Params>){tsType
        ? (
          <>
            : <TypeDef {...props} terminate>{tsType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

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

export function CodeBlockInterface({ children, ...props }: {
  children: Child<DocNodeInterface>;
  url: string;
  namespace?: string;
}) {
  const {
    name,
    interfaceDef: {
      typeParams,
      extends: ext,
      indexSignatures,
      callSignatures,
      properties,
      methods,
    },
  } = take(children);
  return (
    <div class={style("codeBlock")}>
      <span class={style("codeKeyword")}>interface</span> {name}{" "}
      <TypeParams code {...props}>{typeParams}</TypeParams>
      <Extends {...props}>{ext}</Extends>{" "}
      &#123;<IndexSignatures code {...props}>{indexSignatures}</IndexSignatures>
      <CallSignatures code {...props}>{callSignatures}</CallSignatures>
      <Properties code {...props}>{properties}</Properties>
      <Methods code {...props}>{methods}</Methods>&#125;
    </div>
  );
}

export function DocBlockInterface(
  { children, ...markdownContext }:
    & { children: Child<DocNodeInterface> }
    & MarkdownContext,
) {
  const {
    location,
    interfaceDef: {
      typeParams,
      extends: exts,
      indexSignatures,
      callSignatures,
      properties,
      methods,
    },
  } = take(children);
  return (
    <div class={style("docBlockItems")}>
      <DocTypeParams location={location} {...markdownContext}>
        {typeParams}
      </DocTypeParams>
      <ExtendsDoc location={location} {...markdownContext}>{exts}</ExtendsDoc>
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

function Extends(
  { children, ...props }: {
    children: Child<TsTypeDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const extensions = take(children, true);
  if (!extensions.length) {
    return null;
  }
  const { code } = props;
  const items = [];
  for (let i = 0; i < extensions.length; i++) {
    items.push(<TypeDef inline {...props}>{extensions[i]}</TypeDef>);
    if (i < extensions.length - 1) {
      items.push(", ");
    }
  }
  return (
    <>
      <span class={style(code ? "codeKeyword" : "keyword")}>{" "}extends</span>
      {" "}
      {items}
    </>
  );
}

function ExtendsDoc(
  { children, location, ...markdownContext }: {
    children: Child<TsTypeDef[]>;
    location: Location;
  } & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map((def) => {
    const id = nameToId("extends", def.repr);
    return (
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocEntry location={location}>
          <TypeDef {...markdownContext}>{def}</TypeDef>
        </DocEntry>
      </div>
    );
  });
  return (
    <>
      <SectionTitle>Extends</SectionTitle>
      {items}
    </>
  );
}

export function IndexSignatures(
  { children, ...props }: {
    children: Child<IndexSignatureDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const items = signatures.map(({ params, readonly, tsType }) => (
    <div>
      {maybe(readonly, <span class={keyword}>readonly{" "}</span>)}[<Params
        {...props}
      >
        {params}
      </Params>]{tsType
        ? (
          <>
            : <TypeDef {...props} terminate>{tsType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
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
    <>
      <SectionTitle>Index Signatures</SectionTitle>
      {items}
    </>
  );
}

function Methods(
  { children, ...props }: {
    children: Child<InterfaceMethodDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const methods = take(children, true);
  if (!methods.length) {
    return null;
  }
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const items = methods.map((
    { name, kind, optional, computed, returnType, typeParams, params },
  ) => (
    <div>
      {kind === "getter"
        ? <span class={keyword}>get{" "}</span>
        : kind === "setter"
        ? <span class={keyword}>set{" "}</span>
        : undefined}
      {name === "new"
        ? <span class={keyword}>{name}{" "}</span>
        : computed
        ? `[${name}]`
        : name}
      {optional ? "?" : undefined}
      <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
        {params}
      </Params>){returnType
        ? (
          <>
            : <TypeDef {...props} terminate>{returnType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
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
      if (optional) {
        tags.push(<Tag color="cyan">optional</Tag>);
      }
      if (isDeprecated({ jsDoc })) {
        tags.push(<Tag color="gray">deprecated</Tag>);
      }
      return (
        <div class={style("docItem")} id={id}>
          <Anchor>{id}</Anchor>
          <DocEntry location={location}>
            {name === "new"
              ? <span class={style("keyword")}>new</span>
              : computed
              ? `[${name}]`
              : name}
            <TypeParams {...markdownContext}>{typeParams}</TypeParams>(<Params
              inline
              {...markdownContext}
            >
              {params}
            </Params>){returnType && (
              <>
                : <TypeDef inline {...markdownContext}>{returnType}</TypeDef>
              </>
            )}
            {tags}
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
    <>
      <SectionTitle>Methods</SectionTitle>
      {items}
    </>
  );
}

function Properties({ children, ...props }: {
  children: Child<InterfacePropertyDef[]>;
  url: string;
  namespace?: string;
  code?: boolean;
}) {
  const properties = take(children, true);
  properties.sort((a, b) => a.name.localeCompare(b.name));
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const items = properties.map((
    { name, readonly, computed, optional, tsType },
  ) => (
    <div>
      {maybe(readonly, <span class={keyword}>readonly{" "}</span>)}
      {maybe(computed, `[${name}]`, name)}
      {maybe(optional, "?")}
      {tsType
        ? (
          <>
            : <TypeDef {...props} terminate>{tsType}</TypeDef>
          </>
        )
        : ";"}
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
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
          <DocEntry location={location}>
            {maybe(computed, `[${name}]`, name)}
            {tsType && (
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
      <SectionTitle>Properties</SectionTitle>
      {items}
    </>
  );
}
