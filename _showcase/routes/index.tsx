import { Head } from "$fresh/runtime.ts";
import { type Handlers, type PageProps } from "$fresh/server.ts";
import type { DocPageIndex, DocPageModule, DocPageSymbol } from "apiland/types";
import { Showcase } from "../components/Showcase.tsx";

interface Data {
  url: URL;
  indexPage: DocPageIndex;
  modulePage: DocPageModule;
  symbolPage: DocPageSymbol;
}

export default function Index({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>doc_components Showcase</title>
      </Head>
      <Showcase {...data} />
    </>
  );
}

export const handler: Handlers<Data> = {
  async GET(_req, { render }) {
    const base = "https://apiland.deno.dev";
    const responses = await Promise.all([
      fetch(`${base}/v2/pages/mod/doc/oak/v11.1.0/examples/`),
      fetch(`${base}/v2/pages/mod/doc/oak/v11.1.0/mod.ts`),
      fetch(`${base}/v2/pages/mod/doc/oak/v11.1.0/mod.ts?symbol=Application`),
    ]);
    const [indexPage, modulePage, symbolPage] = await Promise.all(
      responses.map((res) => res.json()),
    );
    const url = new URL(`https://deno.land/x/oak@v11.1.0`);
    return render({ url, indexPage, modulePage, symbolPage });
  },
};
