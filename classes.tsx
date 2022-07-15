// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { DecoratorDoc, Decorators, DecoratorSubDoc } from "./decorators.tsx";
import {
  type ClassConstructorDef,
  type ClassMethodDef,
  type ClassPropertyDef,
  type DocNodeClass,
  type Location,
  type TsTypeDef,
} from "./deps.ts";
import {
  AccessibilityTag,
  Anchor,
  DocEntry,
  nameToId,
  SectionTitle,
  Tag,
} from "./doc_common.tsx";
import { IndexSignatures, IndexSignaturesDoc } from "./interfaces.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { TypeArguments, TypeDef, TypeParams, TypeParamsDoc } from "./types.tsx";
import { assert, type Child, isDeprecated, maybe, take } from "./utils.ts";

type ClassAccessorDef = ClassMethodDef & { kind: "getter" | "setter" };
type ClassGetterDef = ClassMethodDef & { kind: "getter" };
type ClassSetterDef = ClassMethodDef & { kind: "setter" };
type ClassItemType = "prop" | "method" | "static_prop" | "static_method";
type ClassItemDef = ClassMethodDef | ClassPropertyDef;

function compareAccessibility(
  a: ClassPropertyDef | ClassMethodDef,
  b: ClassPropertyDef | ClassMethodDef,
): number {
  if (a.accessibility !== b.accessibility) {
    if (a.accessibility === "private") {
      return -1;
    }
    if (b.accessibility === "private") {
      return 1;
    }
    if (a.accessibility === "protected") {
      return -1;
    }
    if (b.accessibility === "protected") {
      return 1;
    }
  }
  if (a.name === b.name && isClassAccessor(a) && isClassAccessor(b)) {
    return a.kind === "getter" ? -1 : 1;
  }
  if (a.name.startsWith("[") && b.name.startsWith("[")) {
    return a.name.localeCompare(b.name);
  }
  if (a.name.startsWith("[")) {
    return 1;
  }
  if (b.name.startsWith("[")) {
    return -1;
  }
  return a.name.localeCompare(b.name);
}

function getClassItems({ classDef: { properties, methods } }: DocNodeClass) {
  return [...properties, ...methods].sort((a, b) => {
    if (a.isStatic !== b.isStatic) {
      return a.isStatic ? 1 : -1;
    }
    if (
      (isClassProperty(a) && isClassProperty(b)) ||
      (isClassProperty(a) && isClassAccessor(b)) ||
      (isClassAccessor(a) && isClassProperty(b)) ||
      (isClassAccessor(a) && isClassAccessor(b)) ||
      (isClassMethod(a) && isClassMethod(b))
    ) {
      return compareAccessibility(a, b);
    }
    if (isClassAccessor(a) && !isClassAccessor(b)) {
      return -1;
    }
    if (isClassAccessor(b)) {
      return 1;
    }
    return isClassProperty(a) ? -1 : 1;
  });
}

function getClassItemType(
  item: ClassPropertyDef | ClassMethodDef,
): ClassItemType {
  if (item.isStatic) {
    return isClassProperty(item) || isClassAccessor(item)
      ? "static_prop"
      : "static_method";
  } else {
    return isClassProperty(item) || isClassAccessor(item) ? "prop" : "method";
  }
}

function getClassItemLabel(kind: ClassItemType) {
  switch (kind) {
    case "method":
      return "Methods";
    case "prop":
      return "Properties";
    case "static_method":
      return "Static Methods";
    case "static_prop":
      return "Static Properties";
  }
}

function isClassAccessor(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassAccessorDef {
  return "kind" in value &&
    (value.kind === "getter" || value.kind === "setter");
}

function isClassGetter(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassGetterDef {
  return "kind" in value && value.kind === "getter";
}

function isClassMethod(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassMethodDef & { kind: "method" } {
  return "kind" in value && value.kind === "method";
}

function isClassProperty(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassPropertyDef {
  return "readonly" in value;
}

function isClassSetter(
  value: ClassPropertyDef | ClassMethodDef,
): value is ClassSetterDef {
  return "kind" in value && value.kind === "setter";
}

function ClassItems(
  { children, ...props }: {
    children: Child<ClassItemDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = [];
  let prev: ClassItemType | undefined;
  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    const curr = getClassItemType(def);
    if (prev && prev !== curr) {
      items.push(<div>&nbsp;</div>);
    }
    prev = curr;
    if (isClassMethod(def) || isClassAccessor(def)) {
      items.push(<ClassMethod {...props}>{def}</ClassMethod>);
    } else {
      assert(isClassProperty(def));
      items.push(<ClassProperty {...props}>{def}</ClassProperty>);
    }
  }
  return <div class={style("indent")}>{items}</div>;
}

export function CodeBlockClass(
  { children, ...props }: {
    children: Child<DocNodeClass>;
    url: string;
    namespace?: string;
  },
) {
  const node = take(children);
  const items = getClassItems(node);
  const {
    name,
    classDef: {
      constructors,
      decorators,
      extends: ext,
      indexSignatures,
      isAbstract,
      superTypeParams,
      implements: impl,
      typeParams,
    },
  } = node;
  const hasElements =
    !!(constructors.length || indexSignatures.length || items.length);
  return (
    <div class={style("codeBlock")}>
      {decorators && <Decorators {...props}>{decorators}</Decorators>}
      <span class={style("codeKeyword")}>
        {maybe(isAbstract, "abstract ")}class
      </span>{" "}
      {name}
      <TypeParams code {...props}>{typeParams}</TypeParams>
      <Extends code typeArgs={superTypeParams} {...props}>{ext}</Extends>
      <Implements code {...props}>{impl}</Implements> &#123;
      {maybe(
        hasElements,
        <div class={style("classBody")}>
          <Constructors code {...props}>{constructors}</Constructors>
          <IndexSignatures code {...props}>{indexSignatures}</IndexSignatures>
          <ClassItems code {...props}>{items}</ClassItems>
        </div>,
        " ",
      )}&#125;
    </div>
  );
}

function ClassAccessorDoc(
  { get, set, ...markdownContext }: {
    get?: ClassGetterDef;
    set?: ClassSetterDef;
  } & MarkdownContext,
) {
  const name = (get ?? set)?.name;
  assert(name);
  const id = nameToId("accessor", name);
  const tsType = get?.functionDef.returnType ??
    set?.functionDef.params[0]?.tsType;
  const jsDoc = get?.jsDoc ?? set?.jsDoc;
  const location = get?.location ?? set?.location;
  assert(location);
  const accessibility = get?.accessibility ?? set?.accessibility;
  const isAbstract = get?.isAbstract ?? set?.isAbstract;
  const tags = [];
  if (isAbstract) {
    tags.push(<Tag color="yellow">abstract</Tag>);
  }
  tags.push(<AccessibilityTag>{accessibility}</AccessibilityTag>);
  if (!set) {
    tags.push(<Tag color="purple">readonly</Tag>);
  }
  if (isDeprecated(get ?? set)) {
    tags.push(<Tag color="gray">deprecated</Tag>);
  }
  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>
      <DocEntry location={location}>
        {name}
        {tsType && (
          <span>
            : <TypeDef inline {...markdownContext}>{tsType}</TypeDef>
          </span>
        )}
        {tags}
      </DocEntry>
      <JsDoc tagKinds={["deprecated"]} tagsWithDoc {...markdownContext}>
        {jsDoc}
      </JsDoc>
    </div>
  );
}

function ClassMethodDoc(
  { children, ...markdownContext }:
    & { children: Child<ClassMethodDef[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);
  const id = nameToId("method", defs[0].name);
  const items = defs.map((
    {
      location,
      name,
      jsDoc,
      accessibility,
      optional,
      isAbstract,
      functionDef: { typeParams, params, returnType, decorators },
    },
  ) => {
    const tags = [];
    if (isAbstract) {
      tags.push(<Tag color="yellow">abstract</Tag>);
    }
    tags.push(<AccessibilityTag>{accessibility}</AccessibilityTag>);
    if (optional) {
      tags.push(<Tag color="cyan">optional</Tag>);
    }
    if (isDeprecated({ jsDoc })) {
      tags.push(<Tag color="gray">deprecated</Tag>);
    }
    return (
      <>
        <DocEntry location={location}>
          {name}
          <TypeParams {...markdownContext}>{typeParams}</TypeParams>(<Params
            inline
            {...markdownContext}
          >
            {params}
          </Params>){returnType && (
            <span>
              : <TypeDef {...markdownContext}>{returnType}</TypeDef>
            </span>
          )}
          {tags}
        </DocEntry>
        <JsDoc
          tagKinds={["param", "return", "template", "deprecated"]}
          tagsWithDoc
          {...markdownContext}
        >
          {jsDoc}
        </JsDoc>
        {decorators && (
          <DecoratorSubDoc id={id} {...markdownContext}>
            {decorators}
          </DecoratorSubDoc>
        )}
      </>
    );
  });

  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>
      {items}
    </div>
  );
}

function ClassPropertyDoc(
  { children, ...markdownContext }:
    & { children: Child<ClassPropertyDef> }
    & MarkdownContext,
) {
  const {
    location,
    name,
    tsType,
    jsDoc,
    decorators,
    accessibility,
    isAbstract,
    optional,
    readonly,
  } = take(children);
  const id = nameToId("prop", name);
  const tags = [];
  if (isAbstract) {
    tags.push(<Tag color="yellow">abstract</Tag>);
  }
  tags.push(<AccessibilityTag>{accessibility}</AccessibilityTag>);
  if (optional) {
    tags.push(<Tag color="cyan">optional</Tag>);
  }
  if (readonly) {
    tags.push(<Tag color="purple">readonly</Tag>);
  }
  if (isDeprecated({ jsDoc })) {
    tags.push(<Tag color="gray">deprecated</Tag>);
  }
  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>
      <DocEntry location={location}>
        {name}
        {tsType && (
          <span>
            : <TypeDef inline {...markdownContext}>{tsType}</TypeDef>
          </span>
        )}
        {tags}
      </DocEntry>
      <JsDoc tagKinds={["deprecated"]} tagsWithDoc {...markdownContext}>
        {jsDoc}
      </JsDoc>
      {decorators && (
        <DecoratorSubDoc id={id} {...markdownContext}>
          {decorators}
        </DecoratorSubDoc>
      )}
    </div>
  );
}

function ClassItemsDoc(
  { children, ...markdownContext }:
    & { children: Child<ClassItemDef[]> }
    & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = [];
  let prev: ClassItemType | undefined;
  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    const curr = getClassItemType(def);
    if (curr !== prev) {
      items.push(<SectionTitle>{getClassItemLabel(curr)}</SectionTitle>);
    }
    prev = curr;
    if (isClassGetter(def)) {
      const next = defs[i + 1];
      if (next && isClassSetter(next) && def.name === next.name) {
        i++;
        items.push(
          <ClassAccessorDoc get={def} set={next} {...markdownContext} />,
        );
      } else {
        items.push(<ClassAccessorDoc get={def} {...markdownContext} />);
      }
    } else if (isClassSetter(def)) {
      items.push(<ClassAccessorDoc set={def} {...markdownContext} />);
    } else if (isClassMethod(def)) {
      const methods = [def];
      let next;
      while (
        (next = defs[i + 1]) && next && isClassMethod(next) &&
        def.name === next.name
      ) {
        i++;
        methods.push(next);
      }
      items.push(
        <ClassMethodDoc {...markdownContext}>{methods}</ClassMethodDoc>,
      );
    } else {
      assert(isClassProperty(def));
      items.push(
        <ClassPropertyDoc {...markdownContext}>{def}</ClassPropertyDoc>,
      );
    }
  }
  return <>{items}</>;
}

function ClassMethod(
  { children, ...props }: {
    children: Child<ClassMethodDef>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const {
    accessibility,
    isAbstract,
    isStatic,
    functionDef: {
      decorators,
      isAsync,
      isGenerator,
      typeParams,
      params,
      returnType,
    },
    kind,
    name,
    optional,
  } = take(children);
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const classMethod = style(code ? "codeClassMethod" : "classMethod");
  return (
    <div>
      {decorators && <Decorators {...props}>{decorators}</Decorators>}
      {maybe(
        isStatic || accessibility || isAbstract,
        <span class={keyword}>
          {maybe(isStatic, "static ")}
          {accessibility && `${accessibility} `}
          {maybe(isAbstract, "abstract")}
        </span>,
      )}
      {maybe(
        isAsync || isGenerator || kind === "getter" || kind === "setter",
        <span class={keyword}>
          {maybe(isAsync, "async ")}
          {kind === "getter" ? "get " : kind === "setter" ? "set " : null}
          {maybe(isGenerator, "*")}
        </span>,
      )}
      {maybe(
        kind === "method" || !name.startsWith("["),
        <span class={classMethod}>{name}</span>,
        name,
      )}
      {maybe(optional, "?")}
      <TypeParams {...props}>{typeParams}</TypeParams>(<Params {...props}>
        {params}
      </Params>){returnType && (
        <>
          : <TypeDef {...props} inline>{returnType}</TypeDef>
        </>
      )};{maybe(decorators, <div>&nbsp;</div>)}
    </div>
  );
}

function ClassProperty(
  { children, ...props }: {
    children: Child<ClassPropertyDef>;
    url: string;
    namespace?: string;
    code?: boolean;
  },
) {
  const {
    isStatic,
    accessibility,
    isAbstract,
    readonly,
    name,
    optional,
    decorators,
    tsType,
  } = take(children);
  const { code } = props;
  return (
    <div>
      {decorators && <Decorators {...props}>{decorators}</Decorators>}
      {maybe(
        isStatic || accessibility || isAbstract || readonly,
        <span class={style(code ? "codeKeyword" : "keyword")}>
          {maybe(isStatic, "static ")}
          {accessibility && `${accessibility}`}
          {maybe(isAbstract, "abstract")}
          {maybe(readonly, "readonly")}
        </span>,
      )}
      {name}
      {maybe(optional, "?")}
      {tsType
        ? (
          <>
            : <TypeDef {...props} terminate>{tsType}</TypeDef>
          </>
        )
        : ";"}
      {maybe(decorators, <div>&nbsp;</div>)}
    </div>
  );
}

function Constructors(
  { children, ...props }:
    & { children: Child<ClassConstructorDef[]>; code?: boolean }
    & MarkdownContext,
) {
  const defs = take(children, true);
  const { code } = props;
  const keyword = style(code ? "codeKeyword" : "keyword");
  const items = defs.map(({ accessibility, name, params }) => (
    <div>
      {maybe(
        accessibility,
        <span class={keyword}>{`${accessibility} `}</span>,
      )}
      <span class={keyword}>{name}</span>(<Params {...props}>{params}</Params>);
    </div>
  ));
  return <div class={style("indent")}>{items}</div>;
}

function ConstructorsDoc(
  { children, name, ...markdownContext }:
    & { children: Child<ClassConstructorDef[]>; name: string }
    & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map(({ location, params, jsDoc, accessibility }, i) => {
    const id = nameToId("ctor", String(i));
    return (
      <div class={style("docItem")}>
        <Anchor>{id}</Anchor>
        <DocEntry location={location}>
          <span class={style("keyword")}>new{" "}</span>
          {name}(<Params inline {...markdownContext}>
            {params}
          </Params>)<AccessibilityTag>{accessibility}</AccessibilityTag>
        </DocEntry>
        <JsDoc
          tagKinds={["param", "template", "deprecated"]}
          tagsWithDoc
          {...markdownContext}
        >
          {jsDoc}
        </JsDoc>
      </div>
    );
  });
  return (
    <div>
      <SectionTitle>Constructors</SectionTitle>
      {items}
    </div>
  );
}

export function DocBlockClass(
  { children, ...markdownContext }:
    & { children: Child<DocNodeClass> }
    & MarkdownContext,
) {
  const classNode = take(children);
  const {
    name,
    classDef: {
      constructors,
      decorators,
      indexSignatures,
      extends: ext,
      implements: impl,
      typeParams,
      superTypeParams,
    },
    location,
  } = classNode;
  const classItems = getClassItems(classNode);
  return (
    <div class={style("docBlockItems")}>
      {decorators && (
        <DecoratorDoc {...markdownContext}>{decorators}</DecoratorDoc>
      )}
      <TypeParamsDoc location={location} {...markdownContext}>
        {typeParams}
      </TypeParamsDoc>
      <ExtendsDoc
        location={location}
        typeArgs={superTypeParams}
        {...markdownContext}
      >
        {ext}
      </ExtendsDoc>
      <ImplementsDoc location={location} {...markdownContext}>
        {impl}
      </ImplementsDoc>
      <ConstructorsDoc name={name} {...markdownContext}>
        {constructors}
      </ConstructorsDoc>
      <IndexSignaturesDoc {...markdownContext}>
        {indexSignatures}
      </IndexSignaturesDoc>
      <ClassItemsDoc {...markdownContext}>{classItems}</ClassItemsDoc>
    </div>
  );
}

function Extends(
  { children, typeArgs, ...props }: {
    children: Child<string | undefined>;
    url: string;
    namespace?: string;
    code?: boolean;
    typeArgs: TsTypeDef[];
  },
) {
  const extension = take(children);
  if (!extension) {
    return null;
  }
  const { code, url, namespace } = props;
  const href = services.lookupHref(url, namespace, extension);
  return (
    <>
      <span class={style("codeKeyword")}>{" "}extends{" "}</span>
      {href
        ? (
          <a href={href} class={style(code ? "codeTypeLink" : "typeLink")}>
            {extension}
          </a>
        )
        : extension}
      <TypeArguments {...props}>{typeArgs}</TypeArguments>
    </>
  );
}

function ExtendsDoc(
  { children, location, typeArgs, ...markdownContext }: {
    children: Child<string | undefined>;
    location: Location;
    typeArgs: TsTypeDef[];
  } & MarkdownContext,
) {
  const ext = take(children);
  if (!ext) {
    return null;
  }
  const id = nameToId("extends", ext);
  return (
    <div>
      <SectionTitle>Extends</SectionTitle>
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocEntry location={location}>
          {ext}
          <TypeArguments {...markdownContext}>{typeArgs}</TypeArguments>
        </DocEntry>
      </div>
    </div>
  );
}

function Implements(
  { children, ...props }: {
    children: Child<TsTypeDef[]>;
    url: string;
    namespace?: string;
    code?: boolean;
    inline?: boolean;
  },
) {
  const types = take(children, true);
  if (!types.length) {
    return null;
  }
  const { code } = props;
  const items = [];
  for (let i = 0; i < types.length; i++) {
    items.push(<TypeDef {...props}>{types[i]}</TypeDef>);
    if (i < types.length - 1) {
      items.push(", ");
    }
  }
  return (
    <>
      {" "}
      <span class={style(code ? "codeKeyword" : "keyword")}>
        implements{" "}
      </span>
      {items}
    </>
  );
}

function ImplementsDoc(
  { children, location, ...markdownContext }: {
    children: Child<TsTypeDef[]>;
    location: Location;
  } & MarkdownContext,
) {
  const defs = take(children, true);
  if (!defs.length) {
    return null;
  }
  const items = defs.map((def) => {
    const id = nameToId("implements", def.repr);
    return (
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocEntry location={location}>
          <TypeDef {...markdownContext}>{def}</TypeDef>
        </DocEntry>
      </div>
    );
  });
  return (
    <div>
      <SectionTitle>Implements</SectionTitle>
      {items}
    </div>
  );
}
