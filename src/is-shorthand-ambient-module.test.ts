import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { isShorthandAmbientModule } from "./is-shorthand-ambient-module";

test("is shorthand ambient module", () => {
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

    declare module 'bar';
    `,
  );
  expect(isShorthandAmbientModule(indexFile.getFunctionOrThrow("foo"))).toBe(
    false,
  );
  expect(isShorthandAmbientModule(indexFile.getModuleOrThrow("'bar'"))).toBe(
    true,
  );
});
