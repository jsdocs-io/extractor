import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("ambient namespaces", async () => {
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
    /** Ambient namespace Foo */
    declare namespace Foo {
      /** Interface Bar */
      export interface Bar {
        /** Property qux */
        readonly qux: string;
      }

      /** Variable baz */
      const baz: boolean;
    }

    /** Global variable foo */
    declare var foo: Foo.Bar;

    /** Global read-only variable bar */
    declare const bar: Foo.Bar;

    /** Global function foobar */
    declare function foobar(a: number, b: number): number;
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
