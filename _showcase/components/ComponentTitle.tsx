import { headerify } from "../util.ts";

export function ComponentTitle(
  { children: name, module }: { children: string; module: string },
) {
  const href = `https://github.com/denoland/doc_components/blob/main${module}`;
  return (
    <h3
      class="text-xl py-4"
      id={headerify(name)}
    >
      <a
        href={href}
        class="text-blue-800 dark:text-blue-300 hover:underline"
        target="_blank"
      >
        {name}
      </a>
    </h3>
  );
}
