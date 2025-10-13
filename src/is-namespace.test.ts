import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isNamespace } from "./is-namespace";

test("is namespace", () => {
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

    export namespace Foo {}
    `,
	);
	expect(isNamespace(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isNamespace(indexFile.getModuleOrThrow("Foo"))).toBe(true);
});
