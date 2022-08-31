// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import {
  type Location,
  type ObjectPatPropDef,
  type ParamDef,
} from "../deps.ts";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, maybe, take } from "./utils.ts";
import { Anchor, DocEntry, nameToId } from "./doc_common.tsx";

function ObjectPat(
  { children, ...props }: {
    children: Child<ObjectPatPropDef>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
  },
) {
  const pattern = take(children);
  switch (pattern.kind) {
    case "assign": {
      const { key, value } = pattern;
      return (
        <span>
          {key}
          {maybe(value && value !== "[UNSUPPORTED]", `= ${value}`)}
        </span>
      );
    }
    case "keyValue": {
      const { key, value } = pattern;
      return (
        <span>
          {key}: <Param {...props}>{value}</Param>
        </span>
      );
    }
    case "rest": {
      const { arg } = pattern;
      return (
        <span>
          ...<Param {...props}>{arg}</Param>
        </span>
      );
    }
  }
}

function Param(
  { children, optional, ...props }: {
    children: Child<ParamDef>;
    optional?: boolean;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
  },
) {
  const param = take(children);
  switch (param.kind) {
    case "array": {
      const { elements, optional: paramOptional, tsType } = param;
      const items = elements.map((e) => e && <Param {...props}>{e}</Param>);
      return (
        <span>
          [{items}]{paramOptional || optional ? "?" : ""}
          {tsType && (
            <span>
              : <TypeDef {...props}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
    case "assign": {
      const { left, tsType } = param;
      return (
        <span>
          <Param {...props} optional>{left}</Param>
          {tsType && (
            <span>
              : <TypeDef {...props}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
    case "identifier": {
      const { name, optional: paramOptional, tsType } = param;
      return (
        <span>
          {name}
          {paramOptional || optional ? "?" : ""}
          {tsType && (
            <span>
              : <TypeDef {...props}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
    case "object": {
      const { props: objProps, optional: paramOptional, tsType } = param;
      const items = [];
      for (let i = 0; i < objProps.length; i++) {
        items.push(<ObjectPat {...props}>{objProps[i]}</ObjectPat>);
        if (i < objProps.length - 1) {
          items.push(<span>{", "}</span>);
        }
      }
      return (
        <span>
          &#123; {items} &#125;{paramOptional || optional ? "?" : ""}
          {tsType && (
            <span>
              : <TypeDef {...props}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
    case "rest": {
      const { arg, tsType } = param;
      return (
        <span>
          ...<Param {...props}>{arg}</Param>
          {tsType && (
            <span>
              : <TypeDef {...props}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
  }
}

export function Params(
  { children, ...props }: {
    children: Child<ParamDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
  },
) {
  const params = take(children, true);
  if (!params.length) {
    return null;
  }
  if (params.length < 3 || props.inline) {
    const items = [];
    for (let i = 0; i < params.length; i++) {
      items.push(<Param {...props}>{params[i]}</Param>);
      if (i < params.length - 1) {
        items.push(<span>{", "}</span>);
      }
    }
    return <span>{items}</span>;
  }
  return (
    <div class={style("indent")}>
      {params.map((param) => (
        <div>
          <Param {...props}>{param}</Param>,
        </div>
      ))}
    </div>
  );
}

function paramName(param: ParamDef): string {
  switch (param.kind) {
    case "array":
      return param.elements.map((param) => {
        if (param) {
          return paramName(param);
        } else {
          return " ";
        }
      }).join(", ");
    case "assign":
      return paramName(param.left); // TODO: doc default value
    case "identifier":
      return param.name;
    case "object":
      // TODO
      break;
    case "rest":
      return `...${paramName(param.arg)}`;
      break;
  }
}

export function DocParamDef(
  { children, ...props }: {
    children: Child<ParamDef>;
    location: Location;
    namespace?: string;
    inline?: boolean;
  },
) {
  const param = take(children, true);

  const name = paramName(param) || "foo";
  const id = nameToId("arg", name);

  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>
      <DocEntry name={name} location={props.location}>
        {param.tsType && (
          <span>
            : <TypeDef inline {...props}>{param.tsType}</TypeDef>
          </span>
        )}
      </DocEntry>
      {
        /*<JsDoc tagKinds={["deprecated"]} tagsWithDoc {...props}>
        {jsDoc}
      </JsDoc>*/
      }
      {
        /*{decorators && (
        <DecoratorSubDoc id={id} {...props}>
          {decorators}
        </DecoratorSubDoc>
      )}*/
      }
    </div>
  );
}
