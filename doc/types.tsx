// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

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
} from "../deps.ts";
import { Params } from "./params.tsx";
import { services } from "../services.ts";
import { style } from "../styles.ts";
import { type Child, maybe, take } from "./utils.ts";
import { Context } from "./markdown.tsx";
import { DocEntry, nameToId, Section, tagVariants } from "./doc_common.tsx";

function LiteralIndexSignatures(
  { children, context }: {
    children: Child<LiteralIndexSignatureDef[]>;
    context: Context;
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
      )}[<Params context={context}>
        {params}
      </Params>]{tsType &&
        (
          <>
            :{" "}
            <TypeDef context={context}>
              {tsType}
            </TypeDef>
          </>
        )};{" "}
    </>
  ));

  return <>{items}</>;
}

function LiteralCallSignatures({ children, context }: {
  children: Child<LiteralCallSignatureDef[]>;
  context: Context;
}) {
  const signatures = take(children, true);
  if (!signatures.length) {
    return null;
  }
  const items = signatures.map(({ typeParams, params, tsType }) => (
    <>
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
      )};{" "}
    </>
  ));
  return <>{items}</>;
}

function LiteralProperties(
  { children, context }: {
    children: Child<LiteralPropertyDef[]>;
    context: Context;
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
            <TypeDef context={context}>
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

function LiteralMethods({ children, context }: {
  children: Child<LiteralMethodDef[]>;
  context: Context;
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
        typeParams,
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
        <DocTypeParamsSummary context={context}>
          {typeParams}
        </DocTypeParamsSummary>(<Params context={context}>
          {params}
        </Params>){returnType && (
          <>
            :{" "}
            <TypeDef context={context}>
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
  { children, context }: {
    children: Child<TsTypeDef[] | undefined>;
    context: Context;
  },
) {
  const args = take(children, true);
  if (!args || !args.length || !args[0]) {
    return null;
  }
  const items = [];
  for (let i = 0; i < args.length; i++) {
    items.push(
      <TypeDef context={context}>
        {args[i]}
      </TypeDef>,
    );
    if (i < args.length - 1) {
      items.push(<>{", "}</>);
    }
  }
  return <>&lt;{items}&gt;</>;
}

export function TypeDef({ children, context }: {
  children: Child<TsTypeDef>;
  context: Context;
}) {
  const def = take(children);
  switch (def.kind) {
    case "array":
      return (
        <>
          <TypeDef context={context}>
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
          <TypeDef context={context}>
            {checkType}
          </TypeDef>{" "}
          <span>extends</span>{" "}
          <TypeDef context={context}>
            {extendsType}
          </TypeDef>{" "}
          ?{" "}
          <TypeDef context={context}>
            {trueType}
          </TypeDef>{" "}
          :{" "}
          <TypeDef context={context}>
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
            context={context}
          >
            {fnOrConstructor.typeParams}
          </DocTypeParamsSummary>(<Params context={context}>
            {fnOrConstructor.params}
          </Params>) =&gt;{" "}
          <TypeDef context={context}>
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
          <TypeArguments context={context}>
            {importType.typeParams}
          </TypeArguments>
        </>
      );
    }
    case "indexedAccess": {
      const { indexedAccess: { objType, indexType } } = def;
      return (
        <>
          <TypeDef context={context}>
            {objType}
          </TypeDef>[<TypeDef context={context}>
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
          <TypeParamSummary context={context}>
            {typeParam}
          </TypeParamSummary>
        </>
      );
    }
    case "intersection":
      return (
        <TypeDefIntersection context={context}>
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
        <TypeDefMapped context={context}>
          {def}
        </TypeDefMapped>
      );
    case "optional": {
      const { optional } = def;
      return (
        <TypeDef context={context}>
          {optional}
        </TypeDef>
      );
    }
    case "parenthesized": {
      const { parenthesized } = def;
      return (
        <>
          (<TypeDef context={context}>
            {parenthesized}
          </TypeDef>)
        </>
      );
    }
    case "rest": {
      const { rest } = def;
      return (
        <>
          ...<TypeDef context={context}>
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
        <TypeDefTuple context={context}>
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
          <LiteralIndexSignatures context={context}>
            {indexSignatures}
          </LiteralIndexSignatures>
          <LiteralCallSignatures context={context}>
            {callSignatures}
          </LiteralCallSignatures>
          <LiteralProperties context={context}>
            {properties}
          </LiteralProperties>
          <LiteralMethods context={context}>
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
          <TypeDef context={context}>
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
              <TypeDef context={context}>
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
      if (context.typeParams?.includes(typeRef.typeName)) {
        const url = new URL(context.url);
        url.hash = nameToId("type_param", typeRef.typeName);
        href = url.href;
      } else {
        href = services.lookupHref(
          context.url,
          context.namespace,
          typeRef.typeName,
        );
      }
      return (
        <>
          {href
            ? <a href={href} class="link">{typeRef.typeName}</a>
            : <span>{typeRef.typeName}</span>}
          <TypeArguments context={context}>
            {typeRef.typeParams}
          </TypeArguments>
        </>
      );
    }
    case "union":
      return (
        <TypeDefUnion context={context}>
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
  { children, context }: {
    children: Child<TsTypeIntersectionDef>;
    context: Context;
  },
) {
  const { intersection } = take(children);
  const lastIndex = intersection.length - 1;
  if (intersection.length <= 3) {
    const items = [];
    for (let i = 0; i < intersection.length; i++) {
      items.push(
        <TypeDef context={context}>
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
      <TypeDef context={context}>
        {def}
      </TypeDef>
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function TypeDefMapped(
  { children, context }: {
    children: Child<TsTypeMappedDef>;
    context: Context;
  },
) {
  const {
    mappedType: { readonly, typeParam, nameType, optional, tsType },
  } = take(children);
  return (
    <>
      <MappedReadOnly>{readonly}</MappedReadOnly>[<TypeParamSummary
        constraintKind="in"
        context={context}
      >
        {typeParam}
      </TypeParamSummary>
      {nameType && (
        <>
          <span>
            in keyof{" "}
          </span>
          <TypeDef context={context}>
            {nameType}
          </TypeDef>
        </>
      )}]<MappedOptional>{optional}</MappedOptional>
      {tsType && (
        <>
          :{" "}
          <TypeDef context={context}>
            {tsType}
          </TypeDef>
        </>
      )}
    </>
  );
}

function TypeDefTuple(
  { children, context }: {
    children: Child<TsTypeTupleDef>;
    context: Context;
  },
) {
  const { tuple } = take(children);
  if (tuple.length <= 3) {
    const items = [];
    for (let i = 0; i < tuple.length; i++) {
      items.push(
        <TypeDef context={context}>
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
      <TypeDef context={context}>
        {def}
      </TypeDef>,{" "}
    </div>
  ));
  return <div class={style("indent")}>[{items}]</div>;
}

function TypeDefUnion(
  { children, context }: {
    children: Child<TsTypeUnionDef>;
    context: Context;
  },
) {
  const { union } = take(children);
  const lastIndex = union.length - 1;
  if (union.length <= 3) {
    const items = [];
    for (let i = 0; i < union.length; i++) {
      items.push(
        <TypeDef context={context}>
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
      <TypeDef context={context}>
        {def}
      </TypeDef>
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function TypeParamSummary(
  { children, constraintKind = "extends", context }: {
    children: Child<TsTypeParamDef>;
    constraintKind?: string;
    context: Context;
  },
) {
  const { name, constraint, default: def } = take(children);
  return (
    <>
      <span>{name}</span>
      {constraint && (
        <>
          <span>{` ${constraintKind} `}</span>
          <TypeDef context={context}>
            {constraint}
          </TypeDef>
        </>
      )}
      {def && (
        <>
          <span>{` = `}</span>
          <TypeDef context={context}>
            {def}
          </TypeDef>
        </>
      )}
    </>
  );
}

export function DocTypeParamsSummary(
  { children, context }: {
    children: Child<TsTypeParamDef[]>;
    context: Context;
  },
) {
  const typeParams = take(children, true);
  if (typeParams.length === 0) {
    return null;
  }

  return (
    <span>
      {"<"}
      {typeParams.map((typeParam, i) => (
        <>
          <span>
            <span>{typeParam.name}</span>
            {typeParam.constraint && (
              <span>
                <span>{" extends "}</span>
                <TypeDef context={context}>
                  {typeParam.constraint}
                </TypeDef>
              </span>
            )}
            {typeParam.default && (
              <span>
                <span>{" = "}</span>
                <TypeDef context={context}>
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
  { children, id, location, doc, context }: {
    children: Child<TsTypeParamDef>;
    id: string;
    location: Location;
    doc?: JsDocTagNamed;
    context: Context;
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
      context={context}
    >
      {def.constraint && (
        <span>
          {" extends "}
          <TypeDef context={context}>
            {def.constraint}
          </TypeDef>
        </span>
      )}
      {def.default && (
        <span>
          {" = "}
          <TypeDef context={context}>
            {def.default}
          </TypeDef>
        </span>
      )}
    </DocEntry>
  );
}

export function TypeParamsDoc(
  { children, base, context }: {
    children: Child<TsTypeParamDef[]>;
    base: DocNode;
    context: Context;
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
        context={context}
      >
        {typeParam}
      </TypeParam>
    );
  });

  return <Section title="Type Parameters">{items}</Section>;
}
