import dedent from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "./extract-declarations";

test("no declarations", async () => {
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
    export {};
    `,
	);
	expect(
		await extractDeclarations({
			containerName: "",
			container: indexFile,
			maxDepth: 5,
			project,
		}),
	).toStrictEqual([]);
});

test("no declarations, no project", async () => {
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
    export {};
    `,
	);
	expect(
		await extractDeclarations({
			containerName: "",
			container: indexFile,
			maxDepth: 5,
		}),
	).toStrictEqual([]);
});

test("multiple declarations", async () => {
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
		"file-module.ts",
		dedent`
    export {};
    `,
	);
	const indexFile = project.createSourceFile(
		"index.ts",
		dedent`
    export const fooVar: string;
    export function fooFunc() {}
    export class FooClass {}
    export interface FooInterface {}
    export enum FooEnum {}
    export type FooType = {};
    export namespace FooNamespace {}
    export * as fooModule from './file-module';
    export default 42;
    `,
	);
	const extractedDeclarations = await extractDeclarations({
		containerName: "",
		container: indexFile,
		maxDepth: 5,
	});
	expect(extractedDeclarations.length).toBe(9);
});

test("module container", async () => {
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
    declare module "foo";
    `,
	);

	const extractedDeclarations = await extractDeclarations({
		containerName: "",
		container: indexFile.getModuleOrThrow('"foo"'),
		maxDepth: 5,
	});
	expect(extractedDeclarations).toStrictEqual([]);
});

test("overloaded function", async () => {
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
    /** Docs for function overloads 1 */
    declare function fooFunc(a: number): number;

    /** Docs for function overloads 2 */
    declare function fooFunc(a: string): string;
    `,
	);

	const extractedDeclarations = await extractDeclarations({
		containerName: "",
		container: indexFile,
		maxDepth: 5,
	});
	expect(extractedDeclarations.length).toBe(1);
});

test("function expression", async () => {
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
    export const fooFunc: (a: number) => number;
    `,
	);

	const extractedDeclarations = await extractDeclarations({
		containerName: "",
		container: indexFile,
		maxDepth: 5,
	});
	expect(extractedDeclarations.length).toBe(1);
});

test("merged namespace", async () => {
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
    export namespace Foo {}
    export namespace Foo {}
    `,
	);

	const extractedDeclarations = await extractDeclarations({
		containerName: "",
		container: indexFile,
		maxDepth: 5,
	});
	expect(extractedDeclarations.length).toBe(1);
});
