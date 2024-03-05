import dedent from "ts-dedent";
import {
	ModuleKind,
	ModuleResolutionKind,
	Project,
	ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { isFunction } from "./is-function";

test("is function", () => {
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
    export const foo: string;

    export function bar() {}
    `,
	);
	expect(isFunction(indexFile.getVariableDeclarationOrThrow("foo"))).toBe(
		false,
	);
	expect(isFunction(indexFile.getFunctionOrThrow("bar"))).toBe(true);
});
