import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { globalAmbientDeclarations } from "./global-ambient-declarations";

test("no globals", () => {
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
    export {};
    `,
  );
  expect(globalAmbientDeclarations("", indexFile)).toStrictEqual([]);
});

test("not global", () => {
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
    export const foo: number;
    `,
  );
  expect(globalAmbientDeclarations("", indexFile)).toStrictEqual([]);
});

test("hidden global", () => {
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
    /** @internal */
    declare const foo: number;
    `,
  );
  expect(globalAmbientDeclarations("", indexFile)).toStrictEqual([]);
});

test("global declaration", () => {
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
    declare const foo: number;
    `,
  );
  expect(globalAmbientDeclarations("", indexFile).at(0)?.exportName).toBe(
    "foo",
  );
});
