import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isExpression } from "./is-expression.ts";

test("is expression", () => {
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

    export default 42;
    `,
	);
	expect(isExpression(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isExpression(indexFile.getExportedDeclarations().get("default")?.at(0)!)).toBe(true);
});
