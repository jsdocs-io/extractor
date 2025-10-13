import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { docs } from "./docs";

test("docs", () => {
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
    /** This @packageDocumentation is not the docs for foo */
    export const foo: string;

    /** Docs for bar */
    export const bar: string;

    /** Docs for expression */
    export default 42;

    /** Docs for function overloads 1 */
    declare function fooFunc(a: number): number;

    /** Docs for function overloads 2 */
    declare function fooFunc(a: string): string;

    class FooClass {
      /** Docs for class method overloads 1 */
      fooMethod(a: number): void;

      /** Docs for class method overloads 2 */
      fooMethod(a: string | number) {}
    }

    interface FooInterface {
      /** Docs for interface method overloads 1 */
      fooMethod(a: number): number;

      /** Docs for interface method overloads 2 */
      fooMethod(a: string): string;
    }

    /** Docs for Qux */
    export type Qux = {};
    `,
	);
	expect(docs(indexFile.getVariableDeclarationOrThrow("foo"))).toStrictEqual([]);
	expect(docs(indexFile.getVariableDeclarationOrThrow("bar"))).toStrictEqual([
		"/** Docs for bar */",
	]);
	expect(docs(indexFile.getExportedDeclarations().get("default")?.at(0)!)).toStrictEqual([
		"/** Docs for expression */",
	]);
	expect(docs(indexFile.getFunctionOrThrow("fooFunc"))).toStrictEqual([
		"/** Docs for function overloads 1 */",
		"/** Docs for function overloads 2 */",
	]);
	expect(docs(indexFile.getClassOrThrow("FooClass").getMethodOrThrow("fooMethod"))).toStrictEqual([
		"/** Docs for class method overloads 1 */",
		"/** Docs for class method overloads 2 */",
	]);
	expect(
		docs(indexFile.getInterfaceOrThrow("FooInterface").getMethodOrThrow("fooMethod")),
	).toStrictEqual([
		"/** Docs for interface method overloads 1 */",
		"/** Docs for interface method overloads 2 */",
	]);
	expect(docs(indexFile.getTypeAliasOrThrow("Qux"))).toStrictEqual(["/** Docs for Qux */"]);
});
