import { ok } from "neverthrow";
import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { afterEach, expect, test, vi } from "vitest";
import { extractDeclarations } from "./extract-declarations";
import { packageDeclarations } from "./package-declarations";

vi.mock("./extract-declarations", () => ({
  extractDeclarations: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

test("success", async () => {
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
  vi.mocked(extractDeclarations).mockResolvedValue([]);
  expect(
    await packageDeclarations({
      pkgName: "foo",
      project,
      indexFile,
      maxDepth: 5,
    }),
  ).toStrictEqual(ok([]));
});

test("failure", async () => {
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
  vi.mocked(extractDeclarations).mockRejectedValue(new Error("test"));
  expect(
    (
      await packageDeclarations({
        pkgName: "foo",
        project,
        indexFile,
        maxDepth: 5,
      })
    ).isErr(),
  ).toBe(true);
});
