// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import {
  htmlEntities,
  type LiteralCallSignatureDef,
  type LiteralIndexSignatureDef,
  type LiteralMethodDef,
  type LiteralPropertyDef,
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

function LiteralIndexSignatures(
  { children, ...markdownContext }: {
    children: Child<LiteralIndexSignatureDef[]>;
  } & MarkdownContext,
) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const items = signatures.map(({ params, readonly, tsType }) => (
    <>
      {maybe(
        readonly,
        <span class={style("keyword")}>
          readonly{" "}
        </span>,
      )}[<Params {...markdownContext}>{params}</Params>]{tsType && (
        <>
          : <TypeDef {...markdownContext}>{tsType}</TypeDef>
        </>
      )};{" "}
    </>
  ));

  return <>{items}</>;
}

function LiteralCallSignatures({ children, ...markdownContext }: {
  children: Child<LiteralCallSignatureDef[]>;
} & MarkdownContext) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const items = signatures.map(({ typeParams, params, tsType }) => (
    <>
      <DocTypeParams {...markdownContext}>{typeParams}</DocTypeParams>(<Params
        {...markdownContext}
      >
        {params}
      </Params>){tsType && (
        <>
          : <TypeDef {...markdownContext}>{tsType}</TypeDef>
        </>
      )};{" "}
    </>
  ));
  return <>{items}</>;
}

function LiteralProperties(
  { children, ...markdownContext }: {
    children: Child<LiteralPropertyDef[]>;
  } & MarkdownContext,
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
          <span class={style("keyword")}>
            readonly{" "}
          </span>,
        )}
        {maybe(computed, `[${name}]`, name)}
        {maybe(optional, "?")}
        {tsType
          ? (
            <>
              : <TypeDef {...markdownContext}>{tsType}</TypeDef>
            </>
          )
          : "; "}
      </>
    ),
  );
  return <>{items}</>;
}

function LiteralMethods({ children, ...markdownContext }: {
  children: Child<LiteralMethodDef[]>;
} & MarkdownContext) {
  const methods = take(children, true);
  if (!methods.length) {
    return null;
  }
  const keyword = style("keyword");
  const items = methods.map(
    ({ name, kind, optional, computed, returnType, typeParams, params }) => (
      <>
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
        {maybe(optional, "?")}
        <DocTypeParams {...markdownContext}>{typeParams}</DocTypeParams>(<Params
          {...markdownContext}
        >
          {params}
        </Params>){returnType
          ? (
            <>
              : <TypeDef {...markdownContext}>{returnType}</TypeDef>
            </>
          )
          : "; "}
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
  const keyword = style("keyword");
  switch (readonly) {
    case true:
      return <span class={keyword}>readonly{" "}</span>;
    case "+":
      return <span class={keyword}>+readonly{" "}</span>;
    case "-":
      return <span class={keyword}>-readonly{" "}</span>;
    default:
      return null;
  }
}

export function TypeArguments(
  { children, ...markdownContext }: {
    children: Child<TsTypeDef[] | undefined>;
  } & MarkdownContext,
) {
  const args = take(children, true);
  if (!args || !args.length || !args[0]) {
    return null;
  }
  const items = [];
  for (let i = 0; i < args.length; i++) {
    items.push(<TypeDef {...markdownContext}>{args[i]}</TypeDef>);
    if (i < args.length - 1) {
      items.push(<>{", "}</>);
    }
  }
  return <>&lt;{items}&gt;</>;
}

export function TypeDef({ children, ...markdownContext }: {
  children: Child<TsTypeDef>;
} & MarkdownContext) {
  const def = take(children);
  const keyword = style("keyword");
  switch (def.kind) {
    case "array":
      return (
        <>
          <TypeDef {...markdownContext}>{def.array}</TypeDef>[]
        </>
      );
    case "conditional": {
      const {
        conditionalType: { checkType, extendsType, trueType, falseType },
      } = def;
      return (
        <>
          <TypeDef {...markdownContext}>{checkType}</TypeDef>{" "}
          <span class={keyword}>extends</span>{" "}
          <TypeDef {...markdownContext}>{extendsType}</TypeDef> ?{" "}
          <TypeDef {...markdownContext}>{trueType}</TypeDef> :{" "}
          <TypeDef {...markdownContext}>{falseType}</TypeDef>
        </>
      );
    }
    case "fnOrConstructor": {
      const {
        fnOrConstructor: { constructor, typeParams, params, tsType },
      } = def;
      return (
        <>
          {maybe(constructor, <span class={keyword}>new{" "}</span>)}
          <DocTypeParams {...markdownContext}>{typeParams}
          </DocTypeParams>(<Params
            {...markdownContext}
          >
            {params}
          </Params>) =&gt; <TypeDef {...markdownContext}>{tsType}</TypeDef>
        </>
      );
    }
    case "importType": {
      const { importType: { specifier, qualifier, typeParams } } = def;
      return (
        <>
          <span class={keyword}>import</span>("{specifier}"){qualifier && (
            <span>.{qualifier}</span>
          )}
          <TypeArguments {...markdownContext}>{typeParams}</TypeArguments>
        </>
      );
    }
    case "indexedAccess": {
      const { indexedAccess: { objType, indexType } } = def;
      return (
        <>
          <TypeDef {...markdownContext}>{objType}</TypeDef>[<TypeDef
            {...markdownContext}
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
          <span class={keyword}>infer{" "}</span>
          <TypeParam {...markdownContext}>{typeParam}</TypeParam>
        </>
      );
    }
    case "intersection":
      return (
        <TypeDefIntersection {...markdownContext}>
          {def}
        </TypeDefIntersection>
      );
    case "keyword": {
      const { keyword } = def;
      return (
        <span class={tw`text-[#056CF0]`}>
          {keyword}
        </span>
      );
    }
    case "literal": {
      const { literal: { kind }, repr } = def;
      let item;
      switch (kind) {
        case "bigInt":
          item = (
            <span class={style("numberLiteral")}>
              {repr}
            </span>
          );
          break;
        case "boolean":
          item = <span class={style("boolean")}>{repr}</span>;
          break;
        case "number":
          item = (
            <span class={style("numberLiteral")}>
              {repr}
            </span>
          );
          break;
        case "string":
          item = (
            <span class={style("stringLiteral")}>
              {JSON.stringify(repr)}
            </span>
          );
          break;
        case "template":
          // TODO(@kitsonk) do this properly and escape properly
          item = (
            <span class={style("stringLiteral")}>
              `{repr}`
            </span>
          );
          break;
      }
      return <>{item}</>;
    }
    case "mapped":
      return <TypeDefMapped {...markdownContext}>{def}</TypeDefMapped>;
    case "optional": {
      const { optional } = def;
      return <TypeDef {...markdownContext}>{optional}</TypeDef>;
    }
    case "parenthesized": {
      const { parenthesized } = def;
      return (
        <>
          (<TypeDef {...markdownContext}>{parenthesized}</TypeDef>)
        </>
      );
    }
    case "rest": {
      const { rest } = def;
      return (
        <>
          ...<TypeDef {...markdownContext}>{rest}</TypeDef>
        </>
      );
    }
    case "this": {
      return <span class={keyword}>this</span>;
    }
    case "tuple": {
      return (
        <TypeDefTuple {...markdownContext}>
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
          &#123;<LiteralIndexSignatures {...markdownContext}>
            {indexSignatures}
          </LiteralIndexSignatures>
          <LiteralCallSignatures {...markdownContext}>
            {callSignatures}
          </LiteralCallSignatures>
          <LiteralProperties {...markdownContext}>
            {properties}
          </LiteralProperties>
          <LiteralMethods {...markdownContext}>{methods}</LiteralMethods>&#125;
        </>
      );
    }
    case "typeOperator": {
      const { typeOperator: { operator, tsType } } = def;
      return (
        <>
          <span class={keyword}>{operator}</span>{" "}
          <TypeDef {...markdownContext}>{tsType}</TypeDef>
        </>
      );
    }
    case "typePredicate": {
      const {
        typePredicate: { asserts, param: { type: paramType, name }, type },
      } = def;
      return (
        <>
          {maybe(asserts, <span class={keyword}>asserts{" "}</span>)}
          {maybe(paramType === "this", <span class={keyword}>this</span>, name)}
          {type && (
            <>
              {" is "}
              <TypeDef {...markdownContext}>{type}</TypeDef>
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
      const { typeRef: { typeName, typeParams } } = def;
      const href = services.lookupHref(
        markdownContext.url,
        markdownContext.namespace,
        typeName,
      );
      return (
        <>
          {href
            ? (
              <a href={href} class={style("typeLink")}>
                {typeName}
              </a>
            )
            : <span class={tw`text-[#056CF0]`}>{typeName}</span>}
          <TypeArguments {...markdownContext}>{typeParams}</TypeArguments>
        </>
      );
    }
    case "union":
      return (
        <TypeDefUnion {...markdownContext}>
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
  { children, ...markdownContext }: {
    children: Child<TsTypeIntersectionDef>;
  } & MarkdownContext,
) {
  const { intersection } = take(children);
  const keyword = style("keyword");
  const lastIndex = intersection.length - 1;
  if (intersection.length <= 3) {
    const items = [];
    for (let i = 0; i < intersection.length; i++) {
      items.push(<TypeDef {...markdownContext}>{intersection[i]}</TypeDef>);
      if (i < lastIndex) {
        items.push(<span class={keyword}>{" & "}</span>);
      }
    }
    return <>{items}</>;
  }
  const items = intersection.map((def, i) => (
    <div>
      <span class={keyword}>{" & "}</span>
      <TypeDef {...markdownContext}>{def}</TypeDef>
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function TypeDefMapped(
  { children, ...markdownContext }: {
    children: Child<TsTypeMappedDef>;
  } & MarkdownContext,
) {
  const {
    mappedType: { readonly, typeParam, nameType, optional, tsType },
  } = take(children);
  return (
    <>
      <MappedReadOnly {...markdownContext}>{readonly}
      </MappedReadOnly>[<TypeParam
        constraintKind="in"
        {...markdownContext}
      >
        {typeParam}
      </TypeParam>
      {nameType && (
        <>
          <span class={style("keyword")}>
            in keyof{" "}
          </span>
          <TypeDef {...markdownContext}>{nameType}</TypeDef>
        </>
      )}]<MappedOptional>{optional}</MappedOptional>
      {tsType && (
        <>
          : <TypeDef {...markdownContext}>{tsType}</TypeDef>
        </>
      )}
    </>
  );
}

function TypeDefTuple(
  { children, ...markdownContext }: {
    children: Child<TsTypeTupleDef>;
  } & MarkdownContext,
) {
  const { tuple } = take(children);
  if (tuple.length <= 3) {
    const items = [];
    for (let i = 0; i < tuple.length; i++) {
      items.push(<TypeDef {...markdownContext}>{tuple[i]}</TypeDef>);
      if (i < tuple.length - 1) {
        items.push(", ");
      }
    }
    return <span>[{items}]</span>;
  }
  const items = tuple.map((def) => (
    <div>
      <TypeDef {...markdownContext}>{def}</TypeDef>,{" "}
    </div>
  ));
  return <div class={style("indent")}>[{items}]</div>;
}

function TypeDefUnion(
  { children, ...markdownContext }: {
    children: Child<TsTypeUnionDef>;
  } & MarkdownContext,
) {
  const { union } = take(children);
  const keyword = style("keyword");
  const lastIndex = union.length - 1;
  if (union.length <= 3) {
    const items = [];
    for (let i = 0; i < union.length; i++) {
      items.push(<TypeDef {...markdownContext}>{union[i]}</TypeDef>);
      if (i < lastIndex) {
        items.push(<span class={keyword}>{" | "}</span>);
      }
    }
    return <span>{items}</span>;
  }
  const items = union.map((def) => (
    <div>
      <span class={keyword}>{" | "}</span>
      <TypeDef {...markdownContext}>{def}</TypeDef>
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function TypeParam(
  { children, constraintKind = "extends", ...markdownContext }: {
    children: Child<TsTypeParamDef>;
    constraintKind?: string;
  } & MarkdownContext,
) {
  const { name, constraint, default: def } = take(children);
  const keyword = style("keyword");
  return (
    <>
      <span class={style("typeParam")}>{name}</span>
      {constraint && (
        <>
          <span class={keyword}>{` ${constraintKind} `}</span>
          <TypeDef {...markdownContext}>{constraint}</TypeDef>
        </>
      )}
      {def && (
        <>
          <span class={keyword}>{` = `}</span>
          <TypeDef {...markdownContext}>{def}</TypeDef>
        </>
      )}
    </>
  );
}

export function DocTypeParams(
  { children, ...markdownContext }:
    & { children: Child<TsTypeParamDef[]> }
    & MarkdownContext,
) {
  const typeParams = take(children, true);
  if (typeParams.length === 0) {
    return <></>;
  }

  return (
    <span>
      {"<"}
      {typeParams.map((typeParam, i) => (
        <>
          <span>
            <span class={tw`text-[#056CF0]`}>{typeParam.name}</span>
            {typeParam.constraint && (
              <span>
                <span>{" extends "}</span>
                <TypeDef {...markdownContext}>{typeParam.constraint}</TypeDef>
              </span>
            )}
            {typeParam.default && (
              <span>
                <span>{" = "}</span>
                <TypeDef {...markdownContext}>{typeParam.default}</TypeDef>
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
