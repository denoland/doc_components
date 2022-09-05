// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type ObjectPatPropDef, type ParamDef, tw } from "../deps.ts";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";
import { MarkdownContext } from "./markdown.tsx";

function Param(
  { children, i, markdownContext }: {
    children: Child<ParamDef>;
    i: number;
    markdownContext: MarkdownContext;
  },
) {
  const param = take(children);
  const name = paramName(param, i);

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
      items.push(<Param i={i} markdownContext={markdownContext}>{params[i]}</Param>);
      if (i < params.length - 1) {
        items.push(<span>{", "}</span>);
      }
    }
    return <span>{items}</span>;
  } else {
    return (
      <div class={style("indent")}>
        {params.map((param, i) => (
          <div>
            <Param i={i} markdownContext={markdownContext}>{param}</Param>,
          </div>
        ))}
      </div>
    );
  }
}

export function paramName(param: ParamDef, i: number): unknown {
  switch (param.kind) {
    case "array":
    case "object":
      return <span class={tw`italic`}>unnamed {i}</span>;
    case "assign":
      return paramName(param.left, i);
    case "identifier":
      return param.name;
    case "rest":
      return <span>...{paramName(param.arg, i)}</span>;
  }
}
