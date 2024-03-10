import dedent from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("export named import all", async () => {
	const project = new Project({
		useInMemoryFileSystem: true,
		compilerOptions: {
			lib: ["lib.esnext.full.d.ts"],
			target: ScriptTarget.ESNext,
			module: ModuleKind.ESNext,
			moduleResolution: ModuleResolutionKind.Bundler,
		},
	});
	project.createSourceFile(
		"bar.d.ts",
		dedent`
    export const baz: boolean;
    `,
	);
	project.createSourceFile(
		"foo.d.ts",
		dedent`
    /**
     * Foo module
     */

    /** Variable bar1 */
    export const bar1: string;

    /** Function bar2 */
    export function bar2(a: number, b: number): number;

    /** Interface Bar3 */
    export interface Bar3<T> {
      readonly baz: <U>(t: T, u: U) => boolean;
    }
    `,
	);
	const indexFile = project.createSourceFile(
		"index.d.ts",
		dedent`
    /**
     * This is similar to the structure of \`index.d.ts\` for \`fp-ts@2.9.3\`.
     *
     * @packageDocumentation
     */

    import * as bar from "./bar";
    import * as foo from "./foo";

    export { foo, bar };
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
