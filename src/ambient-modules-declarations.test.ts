import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { ambientModulesDeclarations } from "./ambient-modules-declarations.ts";

test("no ambient modules", () => {
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
		"index.ts",
		dedent`
    export {};
    `,
	);
	expect(ambientModulesDeclarations("", project)).toStrictEqual([]);
});

test("hidden ambient module", () => {
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
		"index.d.ts",
		dedent`
    /** @internal */
    declare module "foo";
    `,
	);
	expect(ambientModulesDeclarations("", project)).toStrictEqual([]);
});

test("ambient module from another package", () => {
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
		"/node_modules/other-package/index.d.ts",
		dedent`
    declare module "foo";
    `,
	);
	expect(ambientModulesDeclarations("", project, "my-package")).toStrictEqual([]);
});

test("shorthand ambient module", () => {
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
		"/index.d.ts",
		dedent`
    /** Module "foo" */
    declare module "foo";
    `,
	);
	const ambientModules = ambientModulesDeclarations("", project);
	expect(ambientModules.length).toBe(1);
	expect(ambientModules[0]?.exportName).toBe('"foo"');
});

test("ambient modules", () => {
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
		"/index.d.ts",
		dedent`
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
	const ambientModules = ambientModulesDeclarations("", project);
	expect(ambientModules.length).toBe(2);
	expect(ambientModules[0]?.exportName).toBe('"bar"');
	expect(ambientModules[1]?.exportName).toBe('"foo bar"');
});
