// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { Fragment } from "https://deno.land/x/nano_jsx@v0.0.33/fragment.ts";
import { h } from "https://deno.land/x/nano_jsx@v0.0.33/core.ts";
import { setup } from "./services.ts";

setup({ runtime: { Fragment, h } });

export { assertEquals } from "https://deno.land/std@0.149.0/testing/asserts.ts";
export { renderSSR } from "https://deno.land/x/nano_jsx@v0.0.33/ssr.ts";
