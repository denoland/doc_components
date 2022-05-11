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

### JSX runtime

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

await setup({ runtime: { Fragment, h } });
```

For example with [Preact](https://preactjs.com/):

```ts
import { Fragment, h } from "https://esm.sh/pract";
import { setup } from "https://deno.land/x/deno_doc_components/services.ts";

await setup({ runtime: { Fragment, h } });
```

For example with [fresh](https://fresh.deno.dev/):

```ts
import {
  Fragment,
  h,
} from "https://raw.githubusercontent.com/lucacasonato/fresh/main/runtime.ts";
import { setup } from "https://deno.land/x/deno_doc_components/services.ts";

await setup({ runtime: { Fragment, h } });
```

For example with [aleph](https://alephjs.org/) (but validate the version of
React that the version of aleph you are using uses):

```ts
import { createElement as h, Fragment } from "https://esm.sh/react@18.1.0";
import { setup } from "https://deno.land/x/deno_doc_components/services.ts";

await setup({ runtime: { Fragment, h } });
```

The tests use Nano JSX, and provide an example of how to setup the runtime.

### Other services

There are other services that may need to be provided to integrate the
components into an application. These can also be provided via `setup()` and
will override the default behavior.

#### `href()`

The function `href()` should return a link string value which will be used at
points in rendering when linking off to other modules and symbols. It has the
following signature:

```ts
interface Configuration {
  href?: (path: string, symbol?: string) => string;
}
```

The `path` will be set to the module being requested (e.g. `/mod.ts`) and
optionally a `symbol` will be provided, if targeting a specific exported symbol
from that module.

#### `lookupSymbolHref()`

The function `lookupSymbolHref()` is used when the components are trying to
resolve a link to a specific symbol. An implementation should attempt to resolve
the symbol from the current namespace to the current module, to the global
namespace, returning a link to the first matching symbol it finds. If the symbol
cannot be found, `undefined` should be returned.

```ts
interface Configuration {
  lookupSymbolHref?: (
    current: string,
    namespace: string | undefined,
    symbol: string,
  ) => string | undefined;
}
```

The `current` will be set to the module that is the current reference point
(e.g. `/mod.ts`), any `namespace` that is in the current scope (e.g. `errors`)
and the symbol that is being looked for (e.g. `Uint8Array`). If the current
namespace is with another namespace, they will be separated by a `.` (e.g.
`custom.errors`).

---

Copyright 2021-2022 the Deno authors. All rights reserved. MIT License.

```
```
