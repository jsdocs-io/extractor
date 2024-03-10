import dedent from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("export equals function and namespace", async () => {
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
    // See https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html

    /**
     * This is the overview.
     *
     * @packageDocumentation
     */

    /** func1 function */
    declare function func1(s: string): func1.Interface1;
    declare function func1(n: number): func1.Interface2;

    /** func1 namespace */
    declare namespace func1 {
      /** Interface1 */
      interface Interface1 {
        readonly foo: string;
      }

      /** Interface2 */
      interface Interface2 {
        readonly bar: number;
      }

      /** var1 */
      const var1: string;
    }

    export = func1;
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
