import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { exportEqualsDeclarations } from "./export-equals-declarations";

test("shorthand ambient module", () => {
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
    "index.d.ts",
    dedent`
    declare module 'foo';
    `,
  );
  expect(
    exportEqualsDeclarations("", indexFile.getModuleOrThrow("'foo'")),
  ).toStrictEqual([]);
});

test("export default", () => {
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
  expect(exportEqualsDeclarations("", indexFile)).toStrictEqual([]);
});

test("export equals expression", () => {
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
    export = 42;
    `,
  );
  expect(exportEqualsDeclarations("", indexFile)).toStrictEqual([]);
});

test("export equals identifier", () => {
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
    declare function foo(s: string): func1.Interface1;
    export = foo;
    `,
  );
  expect(exportEqualsDeclarations("", indexFile).at(0)?.exportName).toBe("foo");
});

test("export equals identifier hidden", () => {
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
    /** @internal */
    declare function foo(s: string): func1.Interface1;
    export = foo;
    `,
  );
  expect(exportEqualsDeclarations("", indexFile)).toStrictEqual([]);
});

test("export equals identifier namespace", () => {
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
    declare namespace foo {};
    export = foo;
    `,
  );
  expect(exportEqualsDeclarations("", indexFile)).toStrictEqual([]);
});
