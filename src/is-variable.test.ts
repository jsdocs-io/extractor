import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isVariable } from "./is-variable.ts";

test("is variable", () => {
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
    export function foo() {}

    // Not a variable because it represents function.
    export const bar: () => void;

    export const baz: string;
    `,
	);
	expect(isVariable(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isVariable(indexFile.getVariableDeclarationOrThrow("bar"))).toBe(false);
	expect(isVariable(indexFile.getVariableDeclarationOrThrow("baz"))).toBe(true);
});
