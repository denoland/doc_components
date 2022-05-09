# deno_doc_components

A set of components used to render [deno_doc](https://deno.land/x/deno_doc)
[DocNodes](https://doc.deno.land/https://deno.land/x/deno_doc/lib/types.d.ts/~/DocNode).

## Usage

These components are abstracted away from any specific JSX engine, and require
the JSX runtime to be configured before any of the components can be rendered.
To do this, import the `setRuntime()` function from `jsx.ts` and provide it with
the runtime.

You will want to invoke `setRuntime()` as you are bootstrapping your
application, but before you attempt to render any JSX.

For example with [Nano JSX](https://nanojsx.io/):

```ts
import { Fragment, h } from "https://deno.land/x/nano_jsx/mod.ts";
import { setRuntime } from "https://deno.land/x/deno_doc_components/jsx.ts";

setRuntime({ Fragment, h });
```

For example with [Preact](https://preactjs.com/):

```ts
import { Fragment, h } from "https://esm.sh/pract";
import { setRuntime } from "https://deno.land/x/deno_doc_components/jsx.ts";

setRuntime({ Fragment, h });
```

For example with [fresh](https://fresh.deno.dev/):

```ts
import {
  Fragment,
  h,
} from "https://raw.githubusercontent.com/lucacasonato/fresh/main/runtime.ts";
import { setRuntime } from "https://deno.land/x/deno_doc_components/jsx.ts";

setRuntime({ Fragment, h });
```

For example with [aleph](https://alephjs.org/) (but validate the version of
React that the version of aleph you are using uses):

```ts
import { createElement as h, Fragment } from "https://esm.sh/react@18.1.0";
import { setRuntime } from "https://deno.land/x/deno_doc_components/jsx.ts";

setRuntime({ Fragment, h });
```

The tests use Nano JSX, and provide an example of how to

---

Copyright 2021-2022 the Deno authors. All rights reserved. MIT License.
