import dedent from "ts-dedent";
import {
	ModuleKind,
	ModuleResolutionKind,
	Project,
	ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("export type import type", async () => {
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
		"foo.d.ts",
		dedent`
    /**
     * Module Foo.
     */

    /** Type alias Foo1 */
    export declare type Foo1 = string | number;

    /** Type alias Foo2 */
    export declare type Foo2 = {
      bar: boolean;
    };

    export {};
    `,
	);
	const indexFile = project.createSourceFile(
		"index.d.ts",
		dedent`
    /**
     * This is similar to the structure of \`index.d.ts\` for \`@jest/types@26.6.2\`.
     *
     * @packageDocumentation
     */

    import type * as Foo from "./foo";

    export type { Foo };
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
