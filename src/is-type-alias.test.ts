import dedent from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isTypeAlias } from "./is-type-alias";

test("is type alias", () => {
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

    export type Foo = {};
    `,
	);
	expect(isTypeAlias(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isTypeAlias(indexFile.getTypeAliasOrThrow("Foo"))).toBe(true);
});
