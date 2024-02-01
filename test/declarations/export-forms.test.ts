import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

// Various kinds of `export` declarations and forms.
// See https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export.

test("export var list", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export var foo: string, bar: number;
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export let list", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export let foo: string, bar: number;
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export const assignment list", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export const foo = 1, bar = 2;
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export let assignment list", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export let foo = 1, bar = 2;
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export var assignment list", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export var foo = 1, bar = 2;
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export named function", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export function foo() {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export named class", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export class Foo() {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export named generator function", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export function* generatorFoo() {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

// TODO:
test("export const object destructure", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export const { foo, bar: baz } = { foo: 1, bar: 2 };
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

// TODO:
test("export const array destructure", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export const [foo, bar] = [1, 2];
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export list", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    function foo() {}
    const bar = "";
    export { foo, bar };
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export list as renamed", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    function foo() {}
    const bar = "";
    export { foo as myFoo, bar as myBar };
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

// Currently not supported by TypeScript.
// See: https://github.com/microsoft/TypeScript/issues/40594.
test("export list as renamed to string", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    function foo() {}
    const bar = "";
    export { foo as "my foo", bar as "my bar" };
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export list as renamed to default", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    function foo() {}
    const bar = "";
    export { foo as default, bar };
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default expression", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export default 1 + 1;
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default named function", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export default function foo() {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default named class", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export default class Foo() {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default named generator function", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export default function* generatorFoo() {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default anonymous function", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export default function() {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default anonymous class", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export default class {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default anonymous generator function", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export default function* () {}
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export all from module", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  project.createSourceFile(
    "module.ts",
    dedent`
    export const foo: string;
    `,
  );
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export * from "./module";
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export all from module as renamed", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  project.createSourceFile(
    "module.ts",
    dedent`
    export const foo: string;
    `,
  );
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export * as myModule from "./module";
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export list from module", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  project.createSourceFile(
    "module.ts",
    dedent`
    export function foo() {}
    export const bar: string;
    export const baz: number;
    `,
  );
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export { foo, bar } from "./module";
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export list as renamed from module", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  project.createSourceFile(
    "module.ts",
    dedent`
    export function foo() {}
    export const bar: string;
    export const baz: number;
    `,
  );
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export { foo as myFoo, bar as myBar } from "./module";
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default from module", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  project.createSourceFile(
    "module.ts",
    dedent`
    export default function foo() {}
    export const bar: string;
    export const baz: number;
    `,
  );
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export { default } from "./module";
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export default as renamed from module", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  project.createSourceFile(
    "module.ts",
    dedent`
    export default function foo() {}
    export const bar: string;
    export const baz: number;
    `,
  );
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export { default as myDefault } from "./module";
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});

test("export empty", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    export {};
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});
