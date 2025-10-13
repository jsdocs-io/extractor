import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { isVariableAssignmentExpression } from "./is-variable-assignment-expression";

test("is variable assignment expression", () => {
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

    let var1;
    export default var1 = "var1";
    `,
	);
	expect(isVariableAssignmentExpression(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(
		isVariableAssignmentExpression(indexFile.getExportedDeclarations().get("default")?.at(0)!),
	).toBe(true);
});
