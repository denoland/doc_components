// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  type DocNode,
  htmlEntities,
  type JsDocTagNamed,
  type LiteralCallSignatureDef,
  type LiteralIndexSignatureDef,
  type LiteralMethodDef,
  type LiteralPropertyDef,
  type Location,
  type TruePlusMinus,
  type TsTypeDef,
  type TsTypeIntersectionDef,
  type TsTypeMappedDef,
  type TsTypeParamDef,
  type TsTypeTupleDef,
  type TsTypeUnionDef,
  tw,
} from "../deps.ts";
import { Params } from "./params.tsx";
import { runtime, services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, maybe, take } from "./utils.ts";
import { MarkdownContext } from "./markdown.tsx";
import { DocEntry, nameToId, Section, tagVariants } from "./doc_common.tsx";

function LiteralIndexSignatures(
  { children, typeParams, markdownContext }: {
    children: Child<LiteralIndexSignatureDef[]>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const items = signatures.map(({ params, readonly, tsType }) => (
    <>
      {maybe(
        readonly,
        <span>
          readonly{" "}
        </span>,
      )}[<Params typeParams={typeParams} markdownContext={markdownContext}>
        {params}
      </Params>]{tsType &&
        (
          <>
            :{" "}
            <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
              {tsType}
            </TypeDef>
          </>
        )};{" "}
    </>
  ));

  return <>{items}</>;
}

function LiteralCallSignatures({ children, typeParams, markdownContext }: {
  children: Child<LiteralCallSignatureDef[]>;
  typeParams: string[];
  markdownContext: MarkdownContext;
}) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const items = signatures.map((
    { typeParams: localTypeParams, params, tsType },
  ) => (
    <>
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
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {tsType}
          </TypeDef>
        </>
      )};{" "}
    </>
  ));
  return <>{items}</>;
}

function LiteralProperties(
  { children, typeParams, markdownContext }: {
    children: Child<LiteralPropertyDef[]>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const properties = take(children, true);
  if (!properties.length) {
    return null;
  }
  const items = properties.map(
    ({ name, readonly, computed, optional, tsType }) => (
      <>
        {maybe(
          readonly,
          <span>
            readonly{" "}
          </span>,
        )}
        {maybe(computed, `[${name}]`, name)}
        {maybe(optional, "?")}
        {tsType && (
          <>
            :{" "}
            <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
              {tsType}
            </TypeDef>
          </>
        )}
        {"; "}
      </>
    ),
  );
  return <>{items}</>;
}

function LiteralMethods({ children, typeParams, markdownContext }: {
  children: Child<LiteralMethodDef[]>;
  typeParams: string[];
  markdownContext: MarkdownContext;
}) {
  const methods = take(children, true);
  if (!methods.length) {
    return null;
  }
  const items = methods.map(
    (
      {
        name,
        kind,
        optional,
        computed,
        returnType,
        typeParams: localTypeParams,
        params,
      },
    ) => (
      <>
        {kind === "getter"
          ? <span>get{" "}</span>
          : kind === "setter"
          ? <span>set{" "}</span>
          : undefined}
        {name === "new"
          ? <span>{name}{" "}</span>
          : computed
          ? `[${name}]`
          : name}
        {maybe(optional, "?")}
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
        </Params>){returnType && (
          <>
            :{" "}
            <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
              {returnType}
            </TypeDef>
          </>
        )}
        {"; "}
      </>
    ),
  );
  return <>{items}</>;
}

function MappedOptional(
  { children }: { children: Child<TruePlusMinus | undefined> },
) {
  const optional = take(children);
  switch (optional) {
    case true:
      return <>?</>;
    case "+":
      return <>+?</>;
    case "-":
      return <>-?</>;
    default:
      return null;
  }
}

function MappedReadOnly(
  { children }: {
    children: Child<TruePlusMinus | undefined>;
  },
) {
  const readonly = take(children);
  switch (readonly) {
    case true:
      return <span>readonly{" "}</span>;
    case "+":
      return <span>+readonly{" "}</span>;
    case "-":
      return <span>-readonly{" "}</span>;
    default:
      return null;
  }
}

export function TypeArguments(
  { children, typeParams, markdownContext }: {
    children: Child<TsTypeDef[] | undefined>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const args = take(children, true);
  if (!args || !args.length || !args[0]) {
    return null;
  }
  const items = [];
  for (let i = 0; i < args.length; i++) {
    items.push(
      <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
        {args[i]}
      </TypeDef>,
    );
    if (i < args.length - 1) {
      items.push(<>{", "}</>);
    }
  }
  return <>&lt;{items}&gt;</>;
}

export function TypeDef({ children, typeParams, markdownContext }: {
  children: Child<TsTypeDef>;
  typeParams: string[];
  markdownContext: MarkdownContext;
}) {
  const def = take(children);
  switch (def.kind) {
    case "array":
      return (
        <>
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {def.array}
          </TypeDef>[]
        </>
      );
    case "conditional": {
      const {
        conditionalType: { checkType, extendsType, trueType, falseType },
      } = def;
      return (
        <>
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {checkType}
          </TypeDef>{" "}
          <span>extends</span>{" "}
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {extendsType}
          </TypeDef>{" "}
          ?{" "}
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {trueType}
          </TypeDef>{" "}
          :{" "}
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {falseType}
          </TypeDef>
        </>
      );
    }
    case "fnOrConstructor": {
      const { fnOrConstructor } = def;
      return (
        <>
          {maybe(fnOrConstructor.constructor, <span>new{" "}</span>)}
          <DocTypeParamsSummary
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {fnOrConstructor.typeParams}
          </DocTypeParamsSummary>(<Params
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {fnOrConstructor.params}
          </Params>) =&gt;{" "}
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {fnOrConstructor.tsType}
          </TypeDef>
        </>
      );
    }
    case "importType": {
      const { importType } = def;
      return (
        <>
          <span>import</span>("{importType.specifier}"){importType.qualifier &&
            <span>.{importType.qualifier}</span>}
          <TypeArguments
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {importType.typeParams}
          </TypeArguments>
        </>
      );
    }
    case "indexedAccess": {
      const { indexedAccess: { objType, indexType } } = def;
      return (
        <>
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {objType}
          </TypeDef>[<TypeDef
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {indexType}
          </TypeDef>]
        </>
      );
    }
    case "infer": {
      const { infer: { typeParam } } = def;
      return (
        <>
          <span>infer{" "}</span>
          <TypeParamSummary
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {typeParam}
          </TypeParamSummary>
        </>
      );
    }
    case "intersection":
      return (
        <TypeDefIntersection
          typeParams={typeParams}
          markdownContext={markdownContext}
        >
          {def}
        </TypeDefIntersection>
      );
    case "keyword": {
      return <span>{def.keyword}</span>;
    }
    case "literal": {
      const { literal: { kind }, repr } = def;
      let item;
      switch (kind) {
        case "bigInt":
        case "boolean":
        case "number":
          item = <span>{repr}</span>;
          break;
        case "string":
          item = <span>{JSON.stringify(repr)}</span>;
          break;
        case "template":
          // TODO(@kitsonk) do this properly and escape properly
          item = <span>`{repr}`</span>;
          break;
      }
      return <>{item}</>;
    }
    case "mapped":
      return (
        <TypeDefMapped
          typeParams={typeParams}
          markdownContext={markdownContext}
        >
          {def}
        </TypeDefMapped>
      );
    case "optional": {
      const { optional } = def;
      return (
        <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
          {optional}
        </TypeDef>
      );
    }
    case "parenthesized": {
      const { parenthesized } = def;
      return (
        <>
          (<TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {parenthesized}
          </TypeDef>)
        </>
      );
    }
    case "rest": {
      const { rest } = def;
      return (
        <>
          ...<TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {rest}
          </TypeDef>
        </>
      );
    }
    case "this": {
      return <span>this</span>;
    }
    case "tuple": {
      return (
        <TypeDefTuple typeParams={typeParams} markdownContext={markdownContext}>
          {def}
        </TypeDefTuple>
      );
    }
    case "typeLiteral": {
      const {
        typeLiteral: { indexSignatures, callSignatures, properties, methods },
      } = def;
      return (
        <>
          {"{ "}
          <LiteralIndexSignatures
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {indexSignatures}
          </LiteralIndexSignatures>
          <LiteralCallSignatures
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {callSignatures}
          </LiteralCallSignatures>
          <LiteralProperties
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {properties}
          </LiteralProperties>
          <LiteralMethods
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {methods}
          </LiteralMethods>
          {" }"}
        </>
      );
    }
    case "typeOperator": {
      const { typeOperator: { operator, tsType } } = def;
      return (
        <>
          <span>{operator}</span>{" "}
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {tsType}
          </TypeDef>
        </>
      );
    }
    case "typePredicate": {
      const {
        typePredicate: { asserts, param: { type: paramType, name }, type },
      } = def;
      return (
        <>
          {maybe(asserts, <span>asserts{" "}</span>)}
          {maybe(paramType === "this", <span>this</span>, name)}
          {type && (
            <>
              {" is "}
              <TypeDef
                typeParams={typeParams}
                markdownContext={markdownContext}
              >
                {type}
              </TypeDef>
            </>
          )}
        </>
      );
    }
    case "typeQuery": {
      const { typeQuery } = def;
      return <>{typeQuery}</>;
    }
    case "typeRef": {
      const { typeRef } = def;

      let href;
      if (typeParams.includes(typeRef.typeName)) {
        const url = new URL(markdownContext.url);
        url.hash = nameToId("type_param", typeRef.typeName);
        href = url.href;
      } else {
        services.lookupHref(
          markdownContext.url,
          markdownContext.namespace,
          typeRef.typeName,
        );
      }
      return (
        <>
          {href
            ? <a href={href} class={tw`link`}>{typeRef.typeName}</a>
            : <span>{typeRef.typeName}</span>}
          <TypeArguments
            typeParams={typeParams}
            markdownContext={markdownContext}
          >
            {typeRef.typeParams}
          </TypeArguments>
        </>
      );
    }
    case "union":
      return (
        <TypeDefUnion typeParams={typeParams} markdownContext={markdownContext}>
          {def}
        </TypeDefUnion>
      );
    default:
      return (
        <>
          {htmlEntities.encode((def as TsTypeDef).repr)}
        </>
      );
  }
}

function TypeDefIntersection(
  { children, typeParams, markdownContext }: {
    children: Child<TsTypeIntersectionDef>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const { intersection } = take(children);
  const lastIndex = intersection.length - 1;
  if (intersection.length <= 3) {
    const items = [];
    for (let i = 0; i < intersection.length; i++) {
      items.push(
        <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
          {intersection[i]}
        </TypeDef>,
      );
      if (i < lastIndex) {
        items.push(<span>{" & "}</span>);
      }
    }
    return <>{items}</>;
  }
  const items = intersection.map((def) => (
    <div>
      <span>{" & "}</span>
      <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
        {def}
      </TypeDef>
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function TypeDefMapped(
  { children, typeParams, markdownContext }: {
    children: Child<TsTypeMappedDef>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const {
    mappedType: { readonly, typeParam, nameType, optional, tsType },
  } = take(children);
  return (
    <>
      <MappedReadOnly>{readonly}</MappedReadOnly>[<TypeParamSummary
        constraintKind="in"
        typeParams={typeParams}
        markdownContext={markdownContext}
      >
        {typeParam}
      </TypeParamSummary>
      {nameType && (
        <>
          <span>
            in keyof{" "}
          </span>
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {nameType}
          </TypeDef>
        </>
      )}]<MappedOptional>{optional}</MappedOptional>
      {tsType && (
        <>
          :{" "}
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {tsType}
          </TypeDef>
        </>
      )}
    </>
  );
}

function TypeDefTuple(
  { children, typeParams, markdownContext }: {
    children: Child<TsTypeTupleDef>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const { tuple } = take(children);
  if (tuple.length <= 3) {
    const items = [];
    for (let i = 0; i < tuple.length; i++) {
      items.push(
        <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
          {tuple[i]}
        </TypeDef>,
      );
      if (i < tuple.length - 1) {
        items.push(", ");
      }
    }
    return <span>[{items}]</span>;
  }
  const items = tuple.map((def) => (
    <div>
      <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
        {def}
      </TypeDef>,{" "}
    </div>
  ));
  return <div class={style("indent")}>[{items}]</div>;
}

function TypeDefUnion(
  { children, typeParams, markdownContext }: {
    children: Child<TsTypeUnionDef>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const { union } = take(children);
  const lastIndex = union.length - 1;
  if (union.length <= 3) {
    const items = [];
    for (let i = 0; i < union.length; i++) {
      items.push(
        <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
          {union[i]}
        </TypeDef>,
      );
      if (i < lastIndex) {
        items.push(<span>{" | "}</span>);
      }
    }
    return <span>{items}</span>;
  }
  const items = union.map((def) => (
    <div>
      <span>{" | "}</span>
      <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
        {def}
      </TypeDef>
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function TypeParamSummary(
  { children, typeParams, constraintKind = "extends", markdownContext }: {
    children: Child<TsTypeParamDef>;
    constraintKind?: string;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const { name, constraint, default: def } = take(children);
  return (
    <>
      <span>{name}</span>
      {constraint && (
        <>
          <span>{` ${constraintKind} `}</span>
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {constraint}
          </TypeDef>
        </>
      )}
      {def && (
        <>
          <span>{` = `}</span>
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {def}
          </TypeDef>
        </>
      )}
    </>
  );
}

export function DocTypeParamsSummary(
  { children, typeParams, markdownContext }: {
    children: Child<TsTypeParamDef[]>;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const localTypeParams = take(children, true);
  if (localTypeParams.length === 0) {
    return <></>;
  }

  return (
    <span>
      {"<"}
      {localTypeParams.map((typeParam, i) => (
        <>
          <span>
            <span>{typeParam.name}</span>
            {typeParam.constraint && (
              <span>
                <span>{" extends "}</span>
                <TypeDef
                  typeParams={typeParams}
                  markdownContext={markdownContext}
                >
                  {typeParam.constraint}
                </TypeDef>
              </span>
            )}
            {typeParam.default && (
              <span>
                <span>{" = "}</span>
                <TypeDef
                  typeParams={typeParams}
                  markdownContext={markdownContext}
                >
                  {typeParam.default}
                </TypeDef>
              </span>
            )}
          </span>
          {i !== (typeParams.length - 1) && <span>,{" "}</span>}
        </>
      ))}
      {">"}
    </span>
  );
}

export function TypeParam(
  { children, id, location, doc, typeParams, markdownContext }: {
    children: Child<TsTypeParamDef>;
    id: string;
    location: Location;
    doc?: JsDocTagNamed;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const def = take(children);

  const tags = [];
  if (def.default) {
    tags.push(tagVariants.optional());
  }

  return (
    <DocEntry
      id={id}
      location={location}
      name={def.name}
      tags={tags}
      jsDoc={doc}
      markdownContext={markdownContext}
    >
      {def.constraint && (
        <span>
          {" extends "}
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {def.constraint}
          </TypeDef>
        </span>
      )}
      {def.default && (
        <span>
          {" = "}
          <TypeDef typeParams={typeParams} markdownContext={markdownContext}>
            {def.default}
          </TypeDef>
        </span>
      )}
    </DocEntry>
  );
}

export function TypeParamsDoc(
  { children, base, typeParams, markdownContext }: {
    children: Child<TsTypeParamDef[]>;
    base: DocNode;
    typeParams: string[];
    markdownContext: MarkdownContext;
  },
) {
  const defs = take(children, true);

  const typeParamDocs: JsDocTagNamed[] =
    (base.jsDoc?.tags?.filter(({ kind }) => kind === "template") as
      | JsDocTagNamed[]
      | undefined) ??
      [];

  const items = defs.map((typeParam) => {
    const id = nameToId("type_param", typeParam.name);

    return (
      <TypeParam
        id={id}
        location={base.location}
        doc={typeParamDocs.find(({ name }) => name === typeParam.name)}
        typeParams={typeParams}
        markdownContext={markdownContext}
      >
        {typeParam}
      </TypeParam>
    );
  });

  return <Section title="Type Parameters">{items}</Section>;
}
