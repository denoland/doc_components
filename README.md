# doc_components

A set of components used to render [deno_doc](https://deno.land/x/deno_doc)
[DocNodes](https://doc.deno.land/https://deno.land/x/deno_doc/lib/types.d.ts/~/DocNode).

## Showcase

The repository contains a showcase application to see example rendering of the
components in the `_showcase` directory. It can be run locally using:

```
> deno task showcase
```

It is also available on
[deno-doc-components.deno.dev](https://deno-doc-components.deno.dev/).

## Usage

These components are abstracted away from any specific JSX engine, and require
the JSX runtime to be configured before any of the components can be rendered.
To do this, import the `setup()` function from `services.ts` and provide it with
the runtime.

You will want to invoke `setup()` as you are bootstrapping your application, but
before you attempt to render any JSX.

For example with [Nano JSX](https://nanojsx.io/):

```ts
import { Fragment, h } from "https://deno.land/x/nano_jsx/mod.ts";
import { setup } from "https://deno.land/x/deno_doc_components/services.ts";

setup({ runtime: { Fragment, h } });
```

For example with [Preact](https://preactjs.com/):

```ts
import { Fragment, h } from "https://esm.sh/pract";
import { setup } from "https://deno.land/x/deno_doc_components/services.ts";

setup({ runtime: { Fragment, h } });
```

For example with [fresh](https://fresh.deno.dev/):

```ts
import {
  Fragment,
  h,
} from "https://raw.githubusercontent.com/lucacasonato/fresh/main/runtime.ts";
import { setup } from "https://deno.land/x/deno_doc_components/services.ts";

setup({ runtime: { Fragment, h } });
```

For example with [aleph](https://alephjs.org/) (but validate the version of
React that the version of aleph you are using uses):

```ts
import { createElement as h, Fragment } from "https://esm.sh/react@18.1.0";
import { setup } from "https://deno.land/x/deno_doc_components/services.ts";

setup({ runtime: { Fragment, h } });
```

The tests use Nano JSX, and provide an example of how to setup the runtime.

---

Copyright 2021-2022 the Deno authors. All rights reserved. MIT License.
