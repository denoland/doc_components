// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

import {
  type DocNodeClass,
  type DocNodeEnum,
  type DocNodeFunction,
  type DocNodeInterface,
  type DocNodeNamespace,
  type DocNodeTypeAlias,
} from "../deps.ts";

export const classNode: DocNodeClass = {
  name: "AClass",
  kind: "class",
  location: {
    filename: "https://deno.land/x/mod/mod.ts",
    line: 23,
    col: 0,
  },
  declarationKind: "export",
  jsDoc: {
    doc: "a deprecated class",
    tags: [{ kind: "deprecated", doc: "don't use this" }, {
      kind: "example",
      doc:
        '```ignore\nimport { ByteSliceStream } from "https://deno.land/std@$STD_VERSION/streams/buffer.ts";\nconst response = await fetch("https://example.com");\nconst rangedStream = response.body!\n  .pipeThrough(new ByteSliceStream(3, 8));\n```',
    }, {
      kind: "example",
      doc:
        'hello world\n\nmore body text\n```ts\nimport { ByteSliceStream } from "https://deno.land/std@$STD_VERSION/streams/buffer.ts";\nconst response = await fetch("https://example.com");\nconst rangedStream = response.body!\n  .pipeThrough(new ByteSliceStream(3, 8));\n```',
    }],
  },
  classDef: {
    isAbstract: false,
    constructors: [{
      name: "new",
      params: [{
        kind: "identifier",
        name: "a",
        tsType: {
          kind: "keyword",
          keyword: "string",
          repr: "string",
        },
        optional: false,
      }],
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 25,
        col: 2,
      },
      jsDoc: {
        doc: "Some sort of doc `here`. **love it**",
        tags: [{
          kind: "deprecated",
          doc: "some deprecated doc",
        }, {
          kind: "param",
          name: "a",
          doc: "some param _doc_",
        }],
      },
    }],
    properties: [{
      tsType: {
        kind: "keyword",
        keyword: "number",
        repr: "number",
      },
      readonly: false,
      optional: true,
      isAbstract: false,
      isStatic: false,
      name: "someNumber",
      decorators: [{
        name: "log",
        location: {
          filename: "https://deno.land/x/mod/mod.ts",
          line: 30,
          col: 2,
        },
      }],
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 31,
        col: 2,
      },
    }, {
      jsDoc: {
        doc: "some property JSDoc",
        tags: [{ kind: "deprecated" }],
      },
      tsType: {
        kind: "keyword",
        keyword: "string",
        repr: "string",
      },
      readonly: true,
      accessibility: "protected",
      optional: false,
      isAbstract: false,
      isStatic: false,
      name: "prop1",
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 30,
        col: 2,
      },
    }],
    indexSignatures: [],
    methods: [{
      kind: "getter",
      name: "value",
      optional: false,
      isAbstract: false,
      isStatic: false,
      functionDef: {
        params: [],
        returnType: {
          kind: "keyword",
          keyword: "string",
          repr: "string",
        },
        isAsync: false,
        isGenerator: false,
        typeParams: [],
      },
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 26,
        col: 2,
      },
    }, {
      kind: "method",
      name: "stringify",
      optional: true,
      isAbstract: false,
      isStatic: true,
      functionDef: {
        params: [{
          kind: "identifier",
          name: "value",
          optional: false,
          tsType: {
            kind: "keyword",
            keyword: "unknown",
            repr: "unknown",
          },
        }],
        isAsync: false,
        isGenerator: false,
        typeParams: [],
      },
      jsDoc: {
        doc: "some js doc for the method",
        tags: [{
          kind: "param",
          name: "value",
          doc: "the value to stringify",
        }],
      },
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 27,
        col: 2,
      },
    }, {
      kind: "setter",
      name: "other",
      optional: false,
      isAbstract: false,
      isStatic: false,
      functionDef: {
        params: [{
          kind: "identifier",
          name: "value",
          optional: false,
          tsType: {
            kind: "keyword",
            keyword: "string",
            repr: "string",
          },
        }],
        isAsync: false,
        isGenerator: false,
        typeParams: [],
      },
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 26,
        col: 2,
      },
    }, {
      kind: "getter",
      name: "other",
      optional: false,
      isAbstract: false,
      isStatic: false,
      functionDef: {
        params: [],
        returnType: {
          kind: "keyword",
          keyword: "string",
          repr: "string",
        },
        isAsync: false,
        isGenerator: false,
        typeParams: [],
      },
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 26,
        col: 2,
      },
    }],
    extends: "Other",
    implements: [{
      kind: "typeRef",
      typeRef: { typeName: "AnInterface" },
      repr: "AnInterface<T>",
    }, {
      kind: "typeRef",
      typeRef: { typeName: "OtherInterface" },
      repr: "OtherInterface",
    }],
    typeParams: [{
      name: "T",
      constraint: { kind: "keyword", keyword: "string", repr: "string" },
    }],
    superTypeParams: [{
      kind: "literal",
      literal: {
        kind: "string",
        string: "other",
      },
      repr: "string",
    }, {
      kind: "typeRef",
      typeRef: { typeName: "Value" },
      repr: "Value",
    }],
    decorators: [{
      name: "debug",
      args: ["arg"],
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 22,
        col: 0,
      },
    }],
  },
};

export const enumNode: DocNodeEnum = {
  name: "SomeEnum",
  kind: "enum",
  location: {
    filename: "https://deno.land/x/mod/mod.ts",
    line: 100,
    col: 0,
  },
  declarationKind: "export",
  enumDef: {
    members: [{
      name: "String",
      init: {
        kind: "literal",
        literal: { kind: "string", string: "string" },
        repr: "string",
      },
      jsDoc: { doc: "Enum member with _JSDoc_." },
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 101,
        col: 2,
      },
    }, {
      name: "Array",
      init: {
        kind: "literal",
        literal: { kind: "string", string: "array" },
        repr: "array",
      },
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 102,
        col: 2,
      },
    }],
  },
};

export const interfaceNode: DocNodeInterface = {
  name: "AnInterface",
  kind: "interface",
  location: {
    filename: "https://deno.land/x/mod/mod.ts",
    line: 200,
    col: 0,
  },
  declarationKind: "export",
  interfaceDef: {
    extends: [{
      kind: "typeRef",
      typeRef: { typeName: "OtherInterface" },
      repr: "OtherInterface",
    }],
    methods: [{
      name: "a",
      kind: "getter",
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 103,
        col: 2,
      },
      optional: false,
      params: [{
        kind: "identifier",
        name: "value",
        tsType: { kind: "keyword", keyword: "string", repr: "string" },
        optional: false,
      }],
      returnType: { kind: "keyword", keyword: "void", repr: "void" },
      typeParams: [],
    }, {
      name: "aMethod",
      kind: "method",
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 101,
        col: 2,
      },
      jsDoc: {
        doc: "some markdown",
        tags: [{ kind: "deprecated", doc: "deprecated doc" }],
      },
      optional: true,
      params: [{
        kind: "identifier",
        name: "a",
        tsType: { kind: "keyword", keyword: "number", repr: "number" },
        optional: true,
      }],
      returnType: {
        kind: "typeRef",
        typeRef: {
          typeName: "Thingy",
          typeParams: [{
            kind: "typeRef",
            typeRef: { typeName: "T" },
            repr: "T",
          }],
        },
        repr: "Thingy<T>",
      },
      typeParams: [],
    }],
    properties: [{
      name: "prop1",
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 102,
        col: 2,
      },
      jsDoc: { doc: "Some prop JSDoc" },
      params: [],
      readonly: true,
      computed: false,
      optional: false,
      tsType: { kind: "keyword", keyword: "string", repr: "string" },
      typeParams: [],
    }],
    callSignatures: [{
      location: {
        filename: "https://deno.land/x/mod/mod.ts",
        line: 104,
        col: 2,
      },
      jsDoc: { doc: "some doc here", tags: [{ kind: "deprecated" }] },
      params: [{
        kind: "identifier",
        name: "a",
        optional: false,
        tsType: { kind: "typeRef", typeRef: { typeName: "T" }, repr: "T" },
      }],
      tsType: { kind: "keyword", keyword: "void", repr: "void" },
      typeParams: [{
        name: "U",
        constraint: { kind: "keyword", keyword: "string", repr: "string" },
      }],
    }],
    indexSignatures: [{
      readonly: false,
      params: [{ kind: "identifier", name: "property", optional: false }],
      tsType: { kind: "keyword", keyword: "string", repr: "string" },
    }],
    typeParams: [{
      name: "T",
      constraint: {
        kind: "keyword",
        keyword: "string",
        repr: "string",
      },
    }],
  },
};

export const fnNodes: DocNodeFunction[] = [{
  kind: "function",
  name: "a",
  location: { filename: "https://deno.land/x/mod/mod.ts", line: 300, col: 0 },
  declarationKind: "export",
  jsDoc: { doc: "overload **one**" },
  functionDef: {
    params: [{
      kind: "identifier",
      name: "b",
      optional: false,
      tsType: { kind: "keyword", keyword: "string", repr: "string" },
    }],
    returnType: { kind: "keyword", keyword: "string", repr: "string" },
    isAsync: false,
    isGenerator: false,
    typeParams: [],
  },
}, {
  kind: "function",
  name: "a",
  location: { filename: "https://deno.land/x/mod/mod.ts", line: 300, col: 0 },
  declarationKind: "export",
  jsDoc: {
    doc: "overload **two**",
    tags: [
      { kind: "param", name: "b", doc: "a param doc" },
      { kind: "deprecated", doc: "don't use this!" },
    ],
  },
  functionDef: {
    params: [{
      kind: "identifier",
      name: "b",
      optional: false,
      tsType: { kind: "keyword", keyword: "number", repr: "number" },
    }],
    returnType: { kind: "keyword", keyword: "number", repr: "number" },
    isAsync: false,
    isGenerator: false,
    typeParams: [],
  },
}];

export const typeAliasNode: DocNodeTypeAlias = {
  kind: "typeAlias",
  name: "StringRecord",
  location: { filename: "https://deno.land/x/mod/mod.ts", line: 500, col: 0 },
  declarationKind: "export",
  jsDoc: {
    doc: "some sort of type alias",
    tags: [{ kind: "template", name: "V", doc: "the value of the record" }],
  },
  typeAliasDef: {
    tsType: {
      kind: "typeRef",
      typeRef: {
        typeName: "Record",
        typeParams: [
          { kind: "keyword", keyword: "string", repr: "string" },
          { kind: "typeRef", typeRef: { typeName: "V" }, repr: "V" },
        ],
      },
      repr: "",
    },
    typeParams: [{ name: "V" }],
  },
};

export const namespaceNode: DocNodeNamespace = {
  kind: "namespace",
  name: "things",
  location: { filename: "https://deno.land/x/mod/mod.ts", line: 400, col: 0 },
  declarationKind: "export",
  jsDoc: { doc: "some namespace level _doc_" },
  namespaceDef: {
    elements: [classNode, enumNode, interfaceNode, ...fnNodes, typeAliasNode],
  },
};
