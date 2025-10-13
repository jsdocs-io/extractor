import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isGlobal } from "./is-global";

test("is global", () => {
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
    declare var foo: number;
    declare const bar: number;
    declare function baz(a: number): void;
    declare namespace qux {};
    `,
	);
	expect(isGlobal(indexFile.getVariableDeclarationOrThrow("foo"))).toBe(true);
	expect(isGlobal(indexFile.getVariableDeclarationOrThrow("bar"))).toBe(true);
	expect(isGlobal(indexFile.getFunctionOrThrow("baz"))).toBe(true);
	expect(isGlobal(indexFile.getModuleOrThrow("qux"))).toBe(true);
});
