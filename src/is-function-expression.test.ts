import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isFunctionExpression } from "./is-function-expression";

test("is function expression", () => {
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

    export const bar = () => {};
    export const baz = function() {};
    export const qux: () => void;
    `,
	);
	expect(isFunctionExpression(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isFunctionExpression(indexFile.getVariableDeclarationOrThrow("bar"))).toBe(true);
	expect(isFunctionExpression(indexFile.getVariableDeclarationOrThrow("baz"))).toBe(true);
	expect(isFunctionExpression(indexFile.getVariableDeclarationOrThrow("qux"))).toBe(true);
});
