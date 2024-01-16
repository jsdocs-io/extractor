import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { isHidden } from "./is-hidden";

test("private properties", () => {
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
    export class Foo {
      bar;
      #baz;
      #qux() {}
      static staticBar;
      static #staticBaz;
      static #staticQux() {}
    }
    `,
  );
  const foo = indexFile.getClassOrThrow("Foo");
  const bar = foo.getPropertyOrThrow("bar");
  const baz = foo.getPropertyOrThrow("#baz");
  const qux = foo.getMethodOrThrow("#qux");
  expect(isHidden(bar)).toBe(false);
  expect(isHidden(baz)).toBe(true);
  expect(isHidden(qux)).toBe(true);
  const staticBar = foo.getPropertyOrThrow("staticBar");
  const staticBaz = foo.getPropertyOrThrow("#staticBaz");
  const staticQux = foo.getMethodOrThrow("#staticQux");
  expect(isHidden(staticBar)).toBe(false);
  expect(isHidden(staticBaz)).toBe(true);
  expect(isHidden(staticQux)).toBe(true);
});

test("private modifier", () => {
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
    export class Foo {
      bar;
      private baz;
      private qux() {}

      static staticBar;
      private static staticBaz;
      static private staticQux() {}
    }
    `,
  );
  const foo = indexFile.getClassOrThrow("Foo");
  const bar = foo.getPropertyOrThrow("bar");
  const baz = foo.getPropertyOrThrow("baz");
  const qux = foo.getMethodOrThrow("qux");
  expect(isHidden(bar)).toBe(false);
  expect(isHidden(baz)).toBe(true);
  expect(isHidden(qux)).toBe(true);
  const staticBar = foo.getPropertyOrThrow("staticBar");
  const staticBaz = foo.getPropertyOrThrow("staticBaz");
  const staticQux = foo.getMethodOrThrow("staticQux");
  expect(isHidden(staticBar)).toBe(false);
  expect(isHidden(staticBaz)).toBe(true);
  expect(isHidden(staticQux)).toBe(true);
});

test("internal tag", () => {
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

    /** @internal */
    export function bar() {}

    /** @INTERNAL */
    export function baz() {}

    /** @see {@link http://example.com | this is not @internal} */
    export function qux() {}
    `,
  );
  const foo = indexFile.getFunctionOrThrow("foo");
  const bar = indexFile.getFunctionOrThrow("bar");
  const baz = indexFile.getFunctionOrThrow("baz");
  const qux = indexFile.getFunctionOrThrow("qux");
  expect(isHidden(foo)).toBe(false);
  expect(isHidden(bar)).toBe(true);
  expect(isHidden(baz)).toBe(true);
  expect(isHidden(qux)).toBe(false);
});
