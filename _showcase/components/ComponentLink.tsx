import { headerify } from "../util.ts";

export function ComponentLink({ children: name }: { children: string }) {
  return (
    <li>
      <a
        href={`#${headerify(name)}`}
        class="text-blue(800 dark:300) hover:underline"
      >
        {name}
      </a>
    </li>
  );
}
