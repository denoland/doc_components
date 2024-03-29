// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_app from "./routes/_app.tsx";
import * as $docblocks from "./routes/docblocks.tsx";
import * as $index from "./routes/index.tsx";
import * as $moduledoc from "./routes/moduledoc.tsx";

import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_app.tsx": $_app,
    "./routes/docblocks.tsx": $docblocks,
    "./routes/index.tsx": $index,
    "./routes/moduledoc.tsx": $moduledoc,
  },
  islands: {},
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
