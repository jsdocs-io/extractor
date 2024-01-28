import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("export default nested namespaces", async () => {
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
    /**
     * This is similar to the structure of \`index.d.ts\` for \`firebase@8.2.2\`.
     *
     * @packageDocumentation
     */

    /** foo doc */
    declare namespace foo {
      /** fooFunc doc */
      function fooFunc(s: string): string;
    }

    /** foo.bar doc */
    declare namespace foo.bar {
      /** foobarFunc doc */
      function foobarFunc(n: number): number;
    }

    /** foo.bar.baz doc */
    declare namespace foo.bar.baz {
      /** foobarbazFunc doc */
      function foobarbazFunc(b: boolean): boolean;
    }

    // Namespace \`abc\` is at depth 6 and should not be extracted
    declare namespace foo.bar.baz.qux.xyz.abc {}

    export default foo;
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
