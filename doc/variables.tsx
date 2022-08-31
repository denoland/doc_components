// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNodeVariable } from "../deps.ts";
import { runtime } from "../services.ts";
import { style } from "../styles.ts";
import { TypeDef } from "./types.tsx";
import { type Child, take } from "./utils.ts";
import { MarkdownContext } from "./markdown.tsx";
