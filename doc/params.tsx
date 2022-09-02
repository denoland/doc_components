// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type ObjectPatPropDef, type ParamDef } from "../deps.ts";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, maybe, take } from "./utils.ts";
import { MarkdownContext } from "./markdown.tsx";

function ObjectPat(
  { children, markdownContext }: {
    children: Child<ObjectPatPropDef>;
    markdownContext: MarkdownContext;
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
          {key}: <Param markdownContext={markdownContext}>{value}</Param>
        </span>
      );
    }
    case "rest": {
      const { arg } = pattern;
      return (
        <span>
          ...<Param markdownContext={markdownContext}>{arg}</Param>
        </span>
      );
    }
  }
}

function Param(
  { children, optional, markdownContext }: {
    children: Child<ParamDef>;
    optional?: boolean;
    markdownContext: MarkdownContext;
  },
) {
  const param = take(children);
  switch (param.kind) {
    case "array": {
      const { elements, optional: paramOptional, tsType } = param;
      const items = elements.map((e) =>
        e && <Param markdownContext={markdownContext}>{e}</Param>
      );
      return (
        <span>
          [{items}]{paramOptional || optional ? "?" : ""}
          {tsType && (
            <span>
              : <TypeDef markdownContext={markdownContext}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
    case "assign": {
      const { left, tsType } = param;
      return (
        <span>
          <Param markdownContext={markdownContext} optional>{left}</Param>
          {tsType && (
            <span>
              : <TypeDef markdownContext={markdownContext}>{tsType}</TypeDef>
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
              : <TypeDef markdownContext={markdownContext}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
    case "object": {
      const { props, optional: paramOptional, tsType } = param;
      const items = [];
      for (let i = 0; i < props.length; i++) {
        items.push(
          <ObjectPat markdownContext={markdownContext}>{props[i]}</ObjectPat>,
        );
        if (i < props.length - 1) {
          items.push(<span>{", "}</span>);
        }
      }
      return (
        <span>
          &#123; {items} &#125;{paramOptional || optional ? "?" : ""}
          {tsType && (
            <span>
              : <TypeDef markdownContext={markdownContext}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
    case "rest": {
      const { arg, tsType } = param;
      return (
        <span>
          ...<Param markdownContext={markdownContext}>{arg}</Param>
          {tsType && (
            <span>
              : <TypeDef markdownContext={markdownContext}>{tsType}</TypeDef>
            </span>
          )}
        </span>
      );
    }
  }
}

export function Params(
  { children, markdownContext }: {
    children: Child<ParamDef[]>;
    markdownContext: MarkdownContext;
  },
) {
  const params = take(children, true);
  if (!params.length) {
    return null;
  }
  if (params.length < 3) {
    const items = [];
    for (let i = 0; i < params.length; i++) {
      items.push(<Param markdownContext={markdownContext}>{params[i]}</Param>);
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
          <Param markdownContext={markdownContext}>{param}</Param>,
        </div>
      ))}
    </div>
  );
}

// @ts-ignore onKeyDown does support strings
export function paramName(param: ParamDef): string {
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
  }
}
