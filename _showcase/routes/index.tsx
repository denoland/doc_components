import { Head } from "$fresh/runtime.ts";
import { Showcase } from "../components/Showcase.tsx";

export default function Home() {
  const url = new URL("https://deno.land/x/oak@v11.1.0/mod.ts");
  return (
    <>
      <Head>
        <title>doc_components Showcase</title>
      </Head>
      <Showcase url={url} />
    </>
  );
}
