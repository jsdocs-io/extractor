import dedent from "ts-dedent";
import {
	ModuleKind,
	ModuleResolutionKind,
	Project,
	ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { isExportedDeclarations } from "./is-exported-declarations";

test("is exported declarations", () => {
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
	const exportedDeclarations = indexFile.getExportedDeclarations();
	expect(exportedDeclarations.size).toBe(9);
	for (const [, declarations] of exportedDeclarations) {
		for (const declaration of declarations) {
			expect(isExportedDeclarations(declaration)).toBe(true);
		}
	}
});

test("arrow function expression", () => {
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
    export default () => {}
    `,
	);
	const exportedDeclarations = indexFile.getExportedDeclarations();
	expect(exportedDeclarations.size).toBe(1);
	for (const [, declarations] of exportedDeclarations) {
		for (const declaration of declarations) {
			expect(isExportedDeclarations(declaration)).toBe(true);
		}
	}
});
