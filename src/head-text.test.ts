import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { headText } from "./head-text";

test("return text from declaration before body without JSDoc", () => {
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
    /** Docs for FooInterface */
    interface FooInterface {
      bar: number;
    }

    /** Docs for FooClass */
    class FooClass extends FooInterface {
      bar;
      constructor() {
        this.bar = 1;
      }
    }

    /** Docs for FooEnum */
    enum FooEnum {
      Bar,
      Baz
    }
    `,
  );
  expect(headText(indexFile.getInterfaceOrThrow("FooInterface"))).toBe(
    "interface FooInterface {}",
  );
  expect(headText(indexFile.getClassOrThrow("FooClass"))).toBe(
    "class FooClass extends FooInterface {}",
  );
  expect(headText(indexFile.getEnumOrThrow("FooEnum"))).toBe("enum FooEnum {}");
});
