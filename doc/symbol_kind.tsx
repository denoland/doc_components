// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { style } from "../styles.ts";

export const docNodeKindColors = {
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
  const [text, bg] = docNodeKindColors["namespace"];
  return (
    <div class={`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}>
      N
    </div>
  );
}

export function Class() {
  const [text, bg] = docNodeKindColors["class"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}
      title="Class"
    >
      c
    </div>
  );
}

export function Enum() {
  const [text, bg] = docNodeKindColors["enum"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}
      title="Enum"
    >
      E
    </div>
  );
}

export function Variable() {
  const [text, bg] = docNodeKindColors["variable"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}
      title="Variable"
    >
      v
    </div>
  );
}

export function Function() {
  const [text, bg] = docNodeKindColors["function"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}
      title="Function"
    >
      f
    </div>
  );
}

export function Interface() {
  const [text, bg] = docNodeKindColors["interface"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}
      title="Interface"
    >
      I
    </div>
  );
}

export function TypeAlias() {
  const [text, bg] = docNodeKindColors["typeAlias"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] ${style("symbolKind")}`}
      title="Type Alias"
    >
      T
    </div>
  );
}
