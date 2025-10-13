import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("export named class with private field", async () => {
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
    /** Class1 */
    export class Class1 {
      // ECMAScript Private Field
      // See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#ecmascript-private-fields
      #foo: string;

      bar: number;

      qux() {
        return "";
      }

      /** @internal */
      constructor(foo: string, bar: number) {
        this.#foo = foo;
        this.bar = bar;
      }
    }
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
