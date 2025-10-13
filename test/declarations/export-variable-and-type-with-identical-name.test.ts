import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("export variable and type with identical name", async () => {
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
    // Similar to usage suggested with zod type inference.
    export type foo = string | number
    export const foo = { a: 1 };
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
