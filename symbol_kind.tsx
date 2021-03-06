// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { tw } from "./deps.ts";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";

export const colors = {
  "namespace": ["#D25646", "#D256461A"],
  "class": ["#20B44B", "#2FA8501A"],
  "enum": ["#22ABB0", "#22ABB01A"],
  "variable": ["#7E57C0", "#7E57C01A"],
  "function": ["#056CF0", "#026BEB1A"],
  "interface": ["#D2A064", "#D4A0681A"],
  "typeAlias": ["#A4478C", "#A4478C1A"],
  "moduleDoc": ["", ""],
  "import": ["", ""],
} as const;

export const docNodeKindMap = {
  "namespace": Namespace,
  "class": Class,
  "enum": Enum,
  "variable": Variable,
  "function": Function,
  "interface": Interface,
  "typeAlias": TypeAlias,
  "moduleDoc": () => null,
  "import": () => null,
} as const;

export function Namespace() {
  const [text, bg] = colors["namespace"];
  return (
    <div class={tw`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}>
      N
    </div>
  );
}

export function Class() {
  const [text, bg] = colors["class"];
  return (
    <div class={tw`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}>
      c
    </div>
  );
}

export function Enum() {
  const [text, bg] = colors["enum"];
  return (
    <div class={tw`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}>
      E
    </div>
  );
}

export function Variable() {
  const [text, bg] = colors["variable"];
  return (
    <div class={tw`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}>
      v
    </div>
  );
}

export function Function() {
  const [text, bg] = colors["function"];
  return (
    <div class={tw`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}>
      f
    </div>
  );
}

export function Interface() {
  const [text, bg] = colors["interface"];
  return (
    <div class={tw`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}>
      I
    </div>
  );
}

export function TypeAlias() {
  const [text, bg] = colors["typeAlias"];
  return (
    <div class={tw`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}>
      T
    </div>
  );
}
