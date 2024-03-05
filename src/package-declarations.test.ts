import { Effect } from "effect";
import dedent from "ts-dedent";
import {
	ModuleKind,
	ModuleResolutionKind,
	Project,
	ScriptTarget,
} from "ts-morph";
import { afterEach, expect, test, vi } from "vitest";
import { extractDeclarations } from "./extract-declarations";
import {
	packageDeclarations,
	type PackageDeclarationsOptions,
} from "./package-declarations";

const _packageDeclarations = (options: PackageDeclarationsOptions) =>
	Effect.runPromise(packageDeclarations(options));

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
	await expect(
		_packageDeclarations({
			pkgName: "foo",
			project,
			indexFile,
			maxDepth: 5,
		}),
	).resolves.toStrictEqual([]);
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
	await expect(
		_packageDeclarations({
			pkgName: "foo",
			project,
			indexFile,
			maxDepth: 5,
		}),
	).rejects.toThrow();
});
