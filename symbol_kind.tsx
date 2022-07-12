// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { tw } from "./deps.ts";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";

export function Namespace() {
  return (
    <div class={tw`bg-[#D256461A] text-[#D25646] ${style("symbolKind")}`}>
      N
    </div>
  );
}

export function Class() {
  return (
    <div class={tw`bg-[#2FA8501A] text-[#20B44B] ${style("symbolKind")}`}>
      c
    </div>
  );
}

export function Enum() {
  return (
    <div class={tw`bg-[#22ABB01A] text-[#22ABB0] ${style("symbolKind")}`}>
      E
    </div>
  );
}

export function Variable() {
  return (
    <div class={tw`bg-[#7E57C01A] text-[#7E57C0] ${style("symbolKind")}`}>
      v
    </div>
  );
}

export function Function() {
  return (
    <div class={tw`bg-[#026BEB1A] text-[#056CF0] ${style("symbolKind")}`}>
      f
    </div>
  );
}

export function Interface() {
  return (
    <div class={tw`bg-[#D4A0681A] text-[#D2A064] ${style("symbolKind")}`}>
      I
    </div>
  );
}

export function TypeAlias() {
  return (
    <div class={tw`bg-[#A4478C1A] text-[#A4478C] ${style("symbolKind")}`}>
      T
    </div>
  );
}
