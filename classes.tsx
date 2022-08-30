// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { DecoratorDoc, DecoratorSubDoc } from "./decorators.tsx";
import {
  type ClassConstructorDef,
  type ClassMethodDef,
  type ClassPropertyDef,
  type DocNodeClass,
  type JsDoc as JsDocType,
  tw,
} from "./deps.ts";
import {
  Anchor,
  DocEntry,
  getAccessibilityTag,
  nameToId,
  SectionTitle,
  Tag,
} from "./doc_common.tsx";
import { IndexSignaturesDoc } from "./interfaces.tsx";
import { JsDoc } from "./jsdoc.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { Params } from "./params.tsx";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { DocTypeParams, TypeDef } from "./types.tsx";
import { assert, type Child, isDeprecated, take } from "./utils.ts";

type ClassAccessorDef = ClassMethodDef & { kind: "getter" | "setter" };
type ClassGetterDef = ClassMethodDef & { kind: "getter" };
type ClassSetterDef = ClassMethodDef & { kind: "setter" };
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
  /*if (isAbstract) {
    tags.push(<Tag color="yellow">abstract</Tag>);
  }
  if (isDeprecated(get ?? set)) {
    tags.push(<Tag color="gray">deprecated</Tag>);
  }*/

  const accessibilityTag = getAccessibilityTag(accessibility);
  if (accessibilityTag) {
    tags.push(accessibilityTag);
  }

  if (get && !set) {
    tags.push(<Tag color="purple">readonly</Tag>);
  } else if (!get && set) {
    tags.push(<Tag color="purple">writeonly</Tag>);
  }

  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>
      <DocEntry location={location} tags={tags} name={name}>
        {tsType && (
          <span>
            :{" "}
            <span class={tw`font-medium`}>
              <TypeDef inline {...markdownContext}>{tsType}</TypeDef>
            </span>
          </span>
        )}
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
  const items: [unknown, JsDocType | undefined][] = defs.map((
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
    const accessibilityTag = getAccessibilityTag(accessibility);
    if (accessibilityTag) {
      tags.push(accessibilityTag);
    }

    /*if (isAbstract) {
      tags.push(<Tag color="yellow">abstract</Tag>);
    }
    if (optional) {
      tags.push(<Tag color="cyan">optional</Tag>);
    }
    if (isDeprecated({ jsDoc })) {
      tags.push(<Tag color="gray">deprecated</Tag>);
    }*/

    return [(
      <>
        <DocEntry location={location} tags={tags} name={name}>
          <DocTypeParams {...markdownContext}>{typeParams}</DocTypeParams>
          (
          <Params
            inline
            {...markdownContext}
          >
            {params}
          </Params>
          )
          {returnType && (
            <span>
              : <TypeDef {...markdownContext}>{returnType}</TypeDef>
            </span>
          )}
        </DocEntry>
        {decorators && (
          <DecoratorSubDoc id={id} {...markdownContext}>
            {decorators}
          </DecoratorSubDoc>
        )}
      </>
    ), jsDoc];
  });

  const jsDocEntries = items.filter(x => x[1]);
  if (jsDocEntries.length === 1) {
    const lastItem = items.at(-1)!;
    lastItem[0] = <>
      {lastItem[0]}
      <JsDoc
        tagKinds={["param", "return", "template", "deprecated"]}
        tagsWithDoc
        {...markdownContext}
      >
        {jsDocEntries[0][1]}
      </JsDoc>
    </>
  } else {
    items.map(item => (
      <>
        {item[0]}
        <JsDoc
          tagKinds={["param", "return", "template", "deprecated"]}
          tagsWithDoc
          {...markdownContext}
        >
          {item[1]}
        </JsDoc>
      </>
    ));
  }

  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>
      {items.map(item => item[0])}
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
  const accessibilityTag = getAccessibilityTag(accessibility);
  if (accessibilityTag) {
    tags.push(accessibilityTag);
  }
  if (readonly) {
    tags.push(<Tag color="purple">readonly</Tag>);
  }
  if (optional) {
    tags.push(<Tag color="cyan">optional</Tag>);
  }
  if (isDeprecated({ jsDoc })) {
    tags.push(<Tag color="gray">deprecated</Tag>);
  }
  return (
    <div class={style("docItem")} id={id}>
      <Anchor>{id}</Anchor>
      <DocEntry location={location} tags={tags} name={name}>
        {tsType && (
          <span>
            : <TypeDef inline {...markdownContext}>{tsType}</TypeDef>
          </span>
        )}
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
    return <></>;
  }

  const properties: any[] = [];
  const methods: any[] = [];
  const staticProperties: any[] = [];
  const staticMethods: any[] = [];

  for (let i = 0; i < defs.length; i++) {
    const def = defs[i];
    if (isClassGetter(def)) {
      const next = defs[i + 1];
      if (next && isClassSetter(next) && def.name === next.name) {
        i++;
        (def.isStatic ? staticProperties : properties).push(
          <ClassAccessorDoc get={def} set={next} {...markdownContext} />,
        );
      } else {
        (def.isStatic ? staticProperties : properties).push(
          <ClassAccessorDoc get={def} {...markdownContext} />,
        );
      }
    } else if (isClassSetter(def)) {
      (def.isStatic ? staticProperties : properties).push(
        <ClassAccessorDoc set={def} {...markdownContext} />,
      );
    } else if (isClassMethod(def)) {
      const methodList = [def];
      let next;
      while (
        (next = defs[i + 1]) && next && isClassMethod(next) &&
        def.name === next.name
      ) {
        i++;
        methodList.push(next);
      }
      (def.isStatic ? staticMethods : methods).push(
        <ClassMethodDoc {...markdownContext}>{methodList}</ClassMethodDoc>,
      );
    } else {
      assert(isClassProperty(def));
      (def.isStatic ? staticProperties : properties).push(
        <ClassPropertyDoc {...markdownContext}>{def}</ClassPropertyDoc>,
      );
    }
  }

  return (
    <>
      {properties.length !== 0 && (
        <div>
          <SectionTitle>Properties</SectionTitle>
          <div class={tw`mt-2 space-y-3`}>
            {properties}
          </div>
        </div>
      )}
      {methods.length !== 0 && (
        <div>
          <SectionTitle>Methods</SectionTitle>
          <div class={tw`mt-2 space-y-3`}>
            {methods}
          </div>
        </div>
      )}
      {staticProperties.length !== 0 && (
        <div>
          <SectionTitle>Static Properties</SectionTitle>
          <div class={tw`mt-2 space-y-3`}>
            {staticProperties}
          </div>
        </div>
      )}
      {staticMethods.length !== 0 && (
        <div>
          <SectionTitle>Static Methods</SectionTitle>
          <div class={tw`mt-2 space-y-3`}>
            {staticMethods}
          </div>
        </div>
      )}
    </>
  );
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
      <div class={style("docItem")} id={id}>
        <Anchor>{id}</Anchor>
        <DocEntry
          location={location}
          tags={[
            <Tag color="purple">new</Tag>,
            getAccessibilityTag(accessibility),
          ]}
          name={name}
        >
          (<Params inline {...markdownContext}>
            {params}
          </Params>)
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

export function DocTitleClass({ children }: { children: Child<DocNodeClass> }) {
  const { classDef } = take(children);

  return (
    <>
      <DocTypeParams>{classDef.typeParams}</DocTypeParams>

      {classDef.implements.length !== 0 && (
        <span>
          <span class={tw`text-[#9CA0AA] italic`}>{" implements "}</span>
          {classDef.implements.map((typeDef, i) => (
            <>
              <TypeDef>{typeDef}</TypeDef>
              {i !== (classDef.implements.length - 1) && <span>,{" "}</span>}
            </>
          ))}
        </span>
      )}

      {classDef.extends && (
        <span>
          <span class={tw`text-[#9CA0AA] italic`}>{" extends "}</span>
          <span>{classDef.extends}</span>
          <span>
            {classDef.superTypeParams.length !== 0 && (
              <span>
                {"<"}
                {classDef.superTypeParams.map((typeDef, i) => (
                  <>
                    <TypeDef>{typeDef}</TypeDef>
                    {i !== (classDef.superTypeParams.length - 1) && (
                      <span>,{" "}</span>
                    )}
                  </>
                ))}
                {">"}
              </span>
            )}
          </span>
        </span>
      )}
    </>
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
    },
    location,
  } = classNode;
  const classItems = getClassItems(classNode);
  return (
    <div class={style("docBlockItems")}>
      {decorators && (
        <DecoratorDoc {...markdownContext}>{decorators}</DecoratorDoc>
      )}

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
