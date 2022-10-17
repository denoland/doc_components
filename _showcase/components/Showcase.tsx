import { apply, tw } from "twind";
import { css } from "twind/css";
import { Markdown } from "../../doc/markdown.tsx";

const app = css({
  ":global": {
    "html": apply`bg(white dark:gray-900)`,
  },
});

function ComponentTitle(
  { children: name, module }: { children: string; module: string },
) {
  const href = `https://github.com/denoland/doc_components/blob/main${module}`;
  return (
    <h3 class={tw`text-xl py-4`} id={name.toLocaleLowerCase()}>
      <a
        href={href}
        class={tw`text-blue(800 dark:300) hover:underline`}
        target="_blank"
      >
        {name}
      </a>
    </h3>
  );
}

export function Showcase({ url }: { url: URL }) {
  return (
    <div
      class={tw`h-screen bg-white dark:(bg-gray-900 text-white) ${app} max-w-screen-xl mx-auto my-4 px-4`}
    >
      <h1 class="text-3xl py-3">Deno Doc Components</h1>
      <h2 class="text-2xl py-2">Component Showcase</h2>
      <hr />
      <ComponentTitle module="/doc/markdown.tsx">
        Markdown Summary
      </ComponentTitle>
      <Markdown summary context={{ url }}>
        {`Some _markdown_ with [links](https://deno.land/) and symbol links, like: {@linkcode Router}`}
      </Markdown>
    </div>
  );
}
