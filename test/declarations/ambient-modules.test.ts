import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("ambient modules", async () => {
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
    /** Module 'foo' */
    declare module "foo";

    /** Module 'bar' */
    declare module "bar" {
      /** Variable var1 */
      const var1: string;

      /** Variable var2 */
      export const var2: boolean;
    }

    /** Module 'foo bar' */
    declare module "foo bar" {
      export default function sum(a: number, b: number): number;
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
