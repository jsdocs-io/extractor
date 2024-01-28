import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("overloaded function with multiple docs", async () => {
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
    /** (A) number to string */
    export function func1(a: number): string;

    /** (B) string to number */
    export function func1(b: string): number;
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
