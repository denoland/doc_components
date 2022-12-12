// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import { comrak, htmlEntities, lowlight, toHtml, tw } from "../deps.ts";
import { services } from "../services.ts";
import { style, type StyleKey } from "../styles.ts";
import { assert, type Child, splitMarkdownTitle, take } from "./utils.ts";

const CODE_BLOCK_RE =
  /<pre><code\sclass="language-([^"]+)">([^<]+)<\/code><\/pre>/m;

/** Matches `{@link ...}`, `{@linkcode ...}, and `{@linkplain ...}` structures
 * in JSDoc */
const JSDOC_LINK_RE = /\{\s*@link(code|plain)?\s+([^}]+)}/m;

const MARKDOWN_OPTIONS: comrak.ComrakOptions = {
  extension: {
    autolink: true,
    descriptionLists: true,
    strikethrough: true,
    superscript: true,
    table: true,
    tagfilter: true,
  },
};

function syntaxHighlight(html: string): string {
  let match;
  while ((match = CODE_BLOCK_RE.exec(html))) {
    let [text, lang, code] = match;
    lang = lang.split(",")[0];
    let codeHTML;
    if (lowlight.registered(lang)) {
      const tree = lowlight.highlight(
        lang,
        htmlEntities.decode(code),
        {
          prefix: "code-",
        },
      );
      codeHTML = toHtml(tree);
    } else {
      codeHTML = code;
    }
    assert(match.index != null);
    html = `${html.slice(0, match.index)}<pre><code>${codeHTML}</code></pre>${
      html.slice(match.index + text.length)
    }`;
  }
  return html;
}

/** Determines if the value looks like a relative or absolute path, or is
 * a URI with a protocol. */
function isLink(link: string): boolean {
  return /^\.{0,2}\//.test(link) || /^[A-Za-z]+:\S/.test(link);
}

function parseLinks(markdown: string, url: URL, namespace?: string): string {
  let match;
  while ((match = JSDOC_LINK_RE.exec(markdown))) {
    const [text, modifier, value] = match;
    let link = value;
    let title;
    const indexOfSpace = value.indexOf(" ");
    const indexOfPipe = value.indexOf("|");
    if (indexOfPipe >= 0) {
      link = value.slice(0, indexOfPipe);
      title = value.slice(indexOfPipe + 1).trim();
    } else if (indexOfSpace >= 0) {
      link = value.slice(0, indexOfSpace);
      title = value.slice(indexOfSpace + 1).trim();
    }
    const href = services.lookupHref(url, namespace, link);
    if (href) {
      if (!title) {
        title = link;
      }
      link = href;
    }
    let replacement;
    if (isLink(link)) {
      if (title) {
        replacement = modifier === "code"
          ? `[\`${title}\`](${link})`
          : `[${title}](${link})`;
      } else {
        replacement = modifier === "code"
          ? `[\`${link}\`](${link})`
          : `[${link}](${link})`;
      }
    } else {
      replacement = modifier === "code"
        ? `{_@link_ \`${link}\`${title ? ` | ${title}` : ""}}`
        : `{_@link_ ${link}${title ? ` | ${title}` : ""}}`;
    }
    markdown = `${markdown.slice(0, match.index)}${replacement}${
      markdown.slice(match.index + text.length)
    }`;
  }
  return markdown;
}

export function mdToHtml(markdown: string): string {
  return syntaxHighlight(comrak.markdownToHTML(markdown, MARKDOWN_OPTIONS));
}

export interface Context {
  url: URL;
  namespace?: string;
  replacers?: [string, string][];
  typeParams?: string[];
}

export function Markdown(
  { children, summary, context }: {
    children: Child<string | undefined>;
    summary?: boolean;
    context: Context;
  },
) {
  let md = take(children);
  if (!md) {
    return null;
  }
  if (context.replacers) {
    for (const [pattern, replacement] of context.replacers) {
      md = md.replaceAll(pattern, replacement);
    }
  }
  let mdStyle: StyleKey = "markdown";
  let additionalStyle = services.markdownStyle;
  if (summary) {
    mdStyle = "markdownSummary";
    additionalStyle = services.markdownSummaryStyle;
    [md] = splitMarkdownTitle(md);
  }

  return (
    <div
      class={style(mdStyle) + " " + tw`${additionalStyle}`}
      dangerouslySetInnerHTML={{
        __html: services.markdownToHTML(
          parseLinks(md, context.url, context.namespace),
        ),
      }}
    />
  );
}

export function JsDoc(
  { children, context }: {
    children: Child<{ doc?: string } | undefined>;
    context: Context;
  },
) {
  const jsDoc = take(children);
  if (!jsDoc) {
    return null;
  }
  return <Markdown context={context}>{jsDoc.doc}</Markdown>;
}
