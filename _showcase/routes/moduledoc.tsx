import { Head } from "$fresh/runtime.ts";
import { ShowcaseModuleDoc } from "../components/ShowcaseModuleDoc.tsx";

export default function ModuleDocs() {
  return (
    <>
      <Head>
        <title>doc_components Showcase | ModuleDoc</title>
      </Head>
      <ShowcaseModuleDoc url={new URL("htps://deno.land/x/oak@v11.1.0/")} />
    </>
  );
}
