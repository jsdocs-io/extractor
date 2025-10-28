import { goTry } from "go-go-try";
import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { afterEach, expect, test, vi } from "vitest";
import { extractDeclarations } from "./extract-declarations.ts";
import { getPackageDeclarations } from "./get-package-declarations.ts";

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
	const [err, declarations] = await goTry(
		getPackageDeclarations({
			pkgName: "foo",
			project,
			indexFile,
			maxDepth: 5,
		}),
	);
	expect(err).toBeUndefined();
	expect(declarations).toStrictEqual([]);
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
	const [err, declarations] = await goTry(
		getPackageDeclarations({
			pkgName: "foo",
			project,
			indexFile,
			maxDepth: 5,
		}),
	);
	expect(err).toBeDefined();
	expect(declarations).toBeUndefined();
});
