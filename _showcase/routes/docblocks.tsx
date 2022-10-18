import { Head } from "$fresh/runtime.ts";
import { type Handlers, type PageProps } from "$fresh/server.ts";
import { type DocNode } from "@doc_components/deps.ts";
import { ShowcaseDocBlocks } from "../components/ShowcaseDocBlocks.tsx";
import {
  classNode,
  enumNode,
  fnNodes,
  interfaceNode,
  namespaceNode,
  typeAliasNode,
} from "../data.ts";

type Data = DocNode[];

export default function DocBlocks({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>doc_components Showcase</title>
      </Head>
      <ShowcaseDocBlocks url={new URL("https://deno.land/x/oak@v11.1.0/")}>
        {data}
      </ShowcaseDocBlocks>
    </>
  );
}

export const handler: Handlers<Data> = {
  GET(_req, { render }) {
    return render([
      classNode,
      enumNode,
      interfaceNode,
      ...fnNodes,
      typeAliasNode,
      namespaceNode,
    ]);
  },
};
