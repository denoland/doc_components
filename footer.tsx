// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import * as Icons from "./icons.tsx";

export function Footer() {
  return (
    <div class="border-t border-grayDefault bg-ultralight text-sm flex justify-center">
      <div class="section-x-inset-xl py-7 lg:py-18 w-full">
        <nav class="flex flex-col gap-7 w-full leading-tight lg:(flex-row gap-0 items-start justify-between)">
          <a href="https://deno.land" class="flex items-center gap-2">
            <Icons.Logo class="h-8 flex-none" />
            <Icons.Deno class="h-4 flex-none lg:hidden" />
          </a>

          <div class="flex flex-col gap-0 divide-incl-y lg:(flex-row gap-16 divide-incl-y-0)">
            <FooterSection
              title="Why Deno?"
              entries={{
                "Develop Locally": "https://deno.land",
                "Deploy Globally": "https://deno.com/deploy",
                "Compare to Node.js": "https://deno.land/manual/node",
                "Benchmarks": "https://deno.land/benchmarks",
              }}
            />
            <FooterSection
              title="Products"
              entries={{
                "Deno CLI": "https://deno.land",
                "Deno Deploy": "https://deno.com/deploy",
                "Deploy Subhosting": "https://deno.com/deploy/subhosting",
                "Fresh": "https://fresh.deno.dev/",
                "SaaSKit": "https://deno.com/saaskit/",
              }}
            />
            <FooterSection
              title="Sources"
              entries={{
                "CLI Manual": "https://deno.land/manual",
                "CLI Runtime API": "https://doc.deno.land/deno/stable",
                "Deploy Docs": "https://deno.com/deploy/docs",
                "Standard Library": "https://deno.land/std",
                "Third-Party Modules": "https://deno.land/x",
              }}
            />
            <FooterSection
              title="Community"
              entries={{
                "Artworks": "https://deno.land/artwork",
                "Translations": "https://deno.land/translations",
                "Showcase": "https://deno.land/showcase",
              }}
            />
            <FooterSection
              title="Company"
              entries={{
                "Careers": "https://deno.com/jobs",
                "Blog": "https://deno.com/blog",
                "Pricing": "https://deno.com/deploy/pricing",
                "News": "https://deno.news",
                "Merch": "https://merch.deno.com",
                "Privacy Policy": "https://deno.com/deploy/docs/privacy-policy",
              }}
            />
          </div>

          <div class="space-y-5 w-60">
            <iframe
              src="https://denostatus.com/embed-status/72b9718f/light-sm"
              height="41"
              frameBorder="0"
              scrolling="no"
              style="border: none;"
              class="w-full focus:outline-none"
            />

            <span class="text-xs text-[#9CA0AA] leading-tight">
              Copyright © 2023 Deno Land Inc.{" "}
              <span class="whitespace-nowrap">All rights reserved.</span>
            </span>

            <div class="flex gap-3 text-[#6C6E78]">
              <a href="https://github.com/denoland">
                <Icons.GitHub class="text-gray-500 hover:text-black" />
              </a>
              <a href="https://discord.gg/deno">
                <Icons.Discord class="text-gray-500 hover:text-black" />
              </a>
              <a href="https://twitter.com/deno_land">
                <Icons.Twitter class="text-gray-500 hover:text-black" />
              </a>
              <a href="https://youtube.com/@deno_land">
                <Icons.YouTube class="text-gray-500 hover:text-black h-6 w-6" />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

function FooterSection(
  { title, entries }: { title: string; entries: Record<string, string> },
) {
  // Make sure we have a unique Id because some entries title are common in the code base
  const id = "Footer" + title;
  return (
    <div>
      <input
        type="checkbox"
        id={id}
        class="hidden checked:(siblings:last-child:flex sibling:children:last-child:children:(odd:hidden even:block))"
        autoComplete="off"
      />
      <label
        htmlFor={id}
        tabIndex={0}
        class="flex items-center justify-between px-1 my-3 lg:(px-0 my-0)"
      >
        <span class="text-sm font-semibold">{title}</span>
        <div class="lg:hidden text-[#9CA0AA]">
          <Icons.Plus />
          <Icons.Minus class="hidden" />
        </div>
      </label>
      <div class="hidden text-[#6C6E78] flex-col flex-wrap pl-1 pb-2 mb-3 gap-2.5 lg:(flex p-0 mt-4 mb-0)">
        {Object.entries(entries).map(([name, link]) => (
          <a href={link} class="whitespace-nowrap block hover:underline">
            {name}
          </a>
        ))}
      </div>
    </div>
  );
}
