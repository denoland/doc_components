// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type ObjectPatPropDef, type ParamDef } from "../deps.ts";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";
import { MarkdownContext } from "./markdown.tsx";

function Param(
  { children, markdownContext }: {
    children: Child<ParamDef>;
    markdownContext: MarkdownContext;
  },
) {
  const param = take(children);
  const name = paramName(param);

  return (
    <span>
      {name}
      {("optional" in param) && param.optional ? "?" : ""}
      {param.tsType && (
        <span>
          : <TypeDef markdownContext={markdownContext}>{param.tsType}</TypeDef>
        </span>
      )}
    </span>
  );
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
  } else {
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
}

function ObjectPatName(pattern: ObjectPatPropDef): string {
  switch (pattern.kind) {
    case "assign": {
      return pattern.key/* + (pattern.value ? ` = ${pattern.value}` : "")*/;
    }
    case "keyValue": {
      return pattern.key/* + ": " + paramName(pattern.value)*/;
    }
    case "rest": {
      return `...${paramName(pattern.arg)}`;
    }
  }
}

export function paramName(param: ParamDef): string {
  switch (param.kind) {
    case "array":
      return `[${
        param.elements.map((param) => {
          if (param) {
            return paramName(param);
          } else {
            return "undefined";
          }
        }).join(", ")
      }]`;
    case "assign":
      return paramName(param.left);
    case "identifier":
      return param.name;
    case "object":
      return `{ ${param.props.map(ObjectPatName).join(", ")} }`;
      break;
    case "rest":
      return `...${paramName(param.arg)}`;
  }
}
