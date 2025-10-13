import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("index file with overview", async () => {
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
    /**
     * This is the overview.
     *
     * @packageDocumentation
     */
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
