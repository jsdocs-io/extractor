import { dedent } from "ts-dedent";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { expect, test } from "vitest";
import {
	isClass,
	isEnum,
	isExpression,
	isFileModule,
	isFunction,
	isFunctionExpression,
	isInterface,
	isNamespace,
	isTypeAlias,
	isVariable,
	isVariableAssignmentExpression,
} from "./declaration-type-guards.ts";

test("isVariable", () => {
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
    export function foo() {}

    // Not a variable because it represents function.
    export const bar: () => void;

    export const baz: string;
    `,
	);
	expect(isVariable(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isVariable(indexFile.getVariableDeclarationOrThrow("bar"))).toBe(false);
	expect(isVariable(indexFile.getVariableDeclarationOrThrow("baz"))).toBe(true);
});

test("isVariableAssignmentExpression", () => {
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
    export function foo() {}

    let var1;
    export default var1 = "var1";
    `,
	);
	expect(isVariableAssignmentExpression(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(
		isVariableAssignmentExpression(indexFile.getExportedDeclarations().get("default")?.at(0)!),
	).toBe(true);
});

test("isExpression", () => {
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
    export function foo() {}

    export default 42;
    `,
	);
	expect(isExpression(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isExpression(indexFile.getExportedDeclarations().get("default")?.at(0)!)).toBe(true);
});

test("isFunction", () => {
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

    export function bar() {}
    `,
	);
	expect(isFunction(indexFile.getVariableDeclarationOrThrow("foo"))).toBe(false);
	expect(isFunction(indexFile.getFunctionOrThrow("bar"))).toBe(true);
});

test("isFunctionExpression", () => {
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
    export function foo() {}

    export const bar = () => {};
    export const baz = function() {};
    export const qux: () => void;
    `,
	);
	expect(isFunctionExpression(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isFunctionExpression(indexFile.getVariableDeclarationOrThrow("bar"))).toBe(true);
	expect(isFunctionExpression(indexFile.getVariableDeclarationOrThrow("baz"))).toBe(true);
	expect(isFunctionExpression(indexFile.getVariableDeclarationOrThrow("qux"))).toBe(true);
});

test("isClass", () => {
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
    export function foo() {}

    export class Foo {}
    `,
	);
	expect(isClass(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isClass(indexFile.getClassOrThrow("Foo"))).toBe(true);
});

test("isInterface", () => {
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
    export function foo() {}

    export interface Foo {}
    `,
	);
	expect(isInterface(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isInterface(indexFile.getInterfaceOrThrow("Foo"))).toBe(true);
});

test("isEnum", () => {
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
    export function foo() {}

    export enum Foo {}
    `,
	);
	expect(isEnum(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isEnum(indexFile.getEnumOrThrow("Foo"))).toBe(true);
});

test("isTypeAlias", () => {
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
    export function foo() {}

    export type Foo = {};
    `,
	);
	expect(isTypeAlias(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isTypeAlias(indexFile.getTypeAliasOrThrow("Foo"))).toBe(true);
});

test("isNamespace", () => {
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
    export function foo() {}

    export namespace Foo {}
    `,
	);
	expect(isNamespace(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isNamespace(indexFile.getModuleOrThrow("Foo"))).toBe(true);
});

test("isFileModule", () => {
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
    export function foo() {}
    `,
	);
	expect(isFileModule(indexFile.getFunctionOrThrow("foo"))).toBe(false);
	expect(isFileModule(indexFile)).toBe(true);
});
