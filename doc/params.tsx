// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { type ComponentChildren, type ParamDef } from "../deps.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";
import { Context } from "./markdown.tsx";

function Param(
  { children, i, context }: {
    children: Child<ParamDef>;
    i: number;
    context: Context;
  },
) {
  const param = take(children);
  const name = paramName(param, i);
  const type = param.kind === "assign" ? param.left.tsType : param.tsType;

  return (
    <span>
      {name}
      {((("optional" in param) && param.optional) || param.kind === "assign") &&
        "?"}
      {type && (
        <span>
          :{" "}
          <TypeDef context={context}>
            {type}
          </TypeDef>
        </span>
      )}
    </span>
  );
}

export function Params(
  { children, context }: {
    children: Child<ParamDef[]>;
    context: Context;
  },
) {
  const params = take(children, true);
  if (!params.length) {
    return null;
  }
  if (params.length < 3) {
    const items = [];
    for (let i = 0; i < params.length; i++) {
      items.push(
        <Param i={i} context={context}>
          {params[i]}
        </Param>,
      );
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
            <Param i={i} context={context}>
              {param}
            </Param>,
          </div>
        ))}
      </div>
    );
  }
}

export function paramName(param: ParamDef, i: number): ComponentChildren {
  switch (param.kind) {
    case "array":
    case "object":
      return <span class="italic">unnamed {i}</span>;
    case "assign":
      return paramName(param.left, i);
    case "identifier":
      return param.name;
    case "rest":
      return <span>...{paramName(param.arg, i)}</span>;
  }
}
