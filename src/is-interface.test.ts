import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isInterface } from "./is-interface";

test("is interface", () => {
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

    export interface Foo {}
    `,
	);
	expect(isInterface(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isInterface(indexFile.getInterfaceOrThrow("Foo"))).toBe(true);
});
