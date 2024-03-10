import dedent from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("export named type declarations", async () => {
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
    /**
     * This is the overview.
     *
     * @packageDocumentation
     */

    /** var1 */
    export declare const var1 = "var1";

    /** func1 */
    export declare function func1(a: number, b: number): number;
    export declare function func1(a: string, b: string): string;

    /** func2 */
    export declare const func2: (a: number, b: number) => number;

    /** Class1 */
    export declare class Class1 {}

    /** Interface1 */
    export declare interface Interface1 {}

    /** Enum1 */
    export declare enum Enum1 {}

    /** TypeAlias1 */
    export declare type TypeAlias1 = number | string;

    /** Namespace1 */
    export declare namespace Namespace1 {}
    `,
	);
	expect(
		await extractDeclarations({
			containerName: "",
			container: indexFile,
			maxDepth: 5,
			project,
		}),
	).toMatchSnapshot();
});
