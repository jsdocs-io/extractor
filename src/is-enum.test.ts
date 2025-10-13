import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isEnum } from "./is-enum";

test("is enum", () => {
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

    export enum Foo {}
    `,
	);
	expect(isEnum(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isEnum(indexFile.getEnumOrThrow("Foo"))).toBe(true);
});
