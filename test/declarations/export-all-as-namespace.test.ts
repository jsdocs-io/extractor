import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src/extract-declarations.ts";

test("export all as namespace", async () => {
	const project = new Project({
		useInMemoryFileSystem: true,
		compilerOptions: {
			lib: ["lib.esnext.full.d.ts"],
			target: ScriptTarget.ESNext,
			module: ModuleKind.ESNext,
			moduleResolution: ModuleResolutionKind.Bundler,
		},
	});
	project.createSourceFile(
		"foo.d.ts",
		dedent`
    /**
     * Module Foo
     */

    /** Variable foo1 */
    export const foo1: string;
    `,
	);
	const indexFile = project.createSourceFile(
		"index.d.ts",
		dedent`
    // See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#export--as-ns-syntax

    // @ts-ignore
    export * as external from "this-package-does-not-exist";
    export * as foo from "./foo";
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
