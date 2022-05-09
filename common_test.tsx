// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { runtime } from "./jsx.ts";

import { assertEquals, renderSSR } from "./deps_test.ts";

import { Test } from "./common.tsx";

Deno.test({
  name: "test",
  fn() {
    const Expected = () => <div>test</div>;
    const expected = renderSSR(<Expected />);
    const actual = renderSSR(<Test />);
    assertEquals(actual, expected);
  },
});
