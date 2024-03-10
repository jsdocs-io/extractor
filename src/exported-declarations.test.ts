import dedent from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import { exportedDeclarations } from "./exported-declarations";

test("no exports", () => {
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
	expect(exportedDeclarations("", indexFile)).toStrictEqual([]);
});

test("hidden export", () => {
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
    /** @internal */
    export const foo: string;
    `,
	);
	expect(exportedDeclarations("", indexFile)).toStrictEqual([]);
});

test("visible export", () => {
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
    export const foo: string;
    `,
	);
	expect(exportedDeclarations("", indexFile).at(0)?.exportName).toBe("foo");
});

test("multiple exports", () => {
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
	expect(exportedDeclarations("", indexFile).length).toBe(9);
});
