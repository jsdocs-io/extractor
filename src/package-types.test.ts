import { Effect } from "effect";
import type { NormalizedPackageJson } from "read-pkg";
import { expect, test } from "vitest";
import { packageTypes } from "./package-types.ts";

function _packageTypes(pkgJson: Partial<NormalizedPackageJson>, subpath: string) {
	return Effect.runPromise(packageTypes(pkgJson, subpath));
}

test("no types", async () => {
	await expect(_packageTypes({}, ".")).rejects.toThrow();
});

test("not type definitions file", async () => {
	await expect(_packageTypes({ types: "foo.wrong" }, ".")).rejects.toThrow();
});

test("`default` subpath not found", async () => {
	await expect(
		_packageTypes(
			{
				name: "foo",
				exports: {
					".": { types: "index.d.ts" },
				},
			},
			"default",
		),
	).rejects.toThrow();
});

test("`custom` subpath not found", async () => {
	await expect(
		_packageTypes(
			{
				name: "foo",
				exports: {
					".": { types: "index.d.ts" },
				},
			},
			"custom",
		),
	).rejects.toThrow();
});

test("types from exports for root `.` subpath", async () => {
	await expect(
		_packageTypes(
			{
				name: "foo",
				exports: {
					".": { types: "index.d.ts" },
				},
			},
			".",
		),
	).resolves.toBe("index.d.ts");
});

test("types from exports for root `foo` package name subpath", async () => {
	await expect(
		_packageTypes(
			{
				name: "foo",
				exports: {
					".": { types: "index.d.ts" },
				},
			},
			"foo",
		),
	).resolves.toBe("index.d.ts");
});

test("types from `custom` subpath", async () => {
	await expect(
		_packageTypes(
			{
				name: "foo",
				exports: {
					".": { types: "index.d.ts" },
					"./custom": { types: "custom.d.ts" },
				},
			},
			"custom",
		),
	).resolves.toBe("custom.d.ts");
});

test("types from `types` fallback", async () => {
	await expect(_packageTypes({ types: "index.d.ts" }, ".")).resolves.toBe("index.d.ts");
});

test("types from `typings` fallback", async () => {
	await expect(_packageTypes({ typings: "index.d.ts" }, ".")).resolves.toBe("index.d.ts");
});

test("types from `types` fallback and not from default condition for root subpath", async () => {
	await expect(
		_packageTypes(
			{
				name: "foo",
				types: "index.d.ts",
				exports: {
					".": { default: "index.js" },
				},
			},
			".",
		),
	).resolves.toBe("index.d.ts");
});

test("types not from `types` fallback if not root subpath", async () => {
	await expect(
		_packageTypes(
			{
				name: "foo",
				types: "index.d.ts",
				exports: {
					".": { default: "index.js" },
				},
			},
			"custom",
		),
	).rejects.toThrow();
});

test("types not from `typings` fallback if not root subpath", async () => {
	await expect(
		_packageTypes(
			{
				name: "foo",
				typings: "index.d.ts",
				exports: {
					".": { default: "index.js" },
				},
			},
			"custom",
		),
	).rejects.toThrow();
});

test("ts-api-utils@2.1.0", async () => {
	await expect(
		_packageTypes(
			{
				name: "ts-api-utils",
				version: "2.1.0",
				type: "module",
				exports: {
					".": {
						types: {
							import: "./lib/index.d.ts",
							require: "./lib/index.d.cts",
						},
						import: "./lib/index.js",
						require: "./lib/index.cjs",
					},
				},
			},
			".",
		),
	).resolves.toBe("./lib/index.d.ts");
});

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#packagejson-exports-imports-and-self-referencing
test("ts 4.7 release", async () => {
	await expect(
		_packageTypes(
			{
				name: "my-package",
				type: "module",
				exports: {
					".": {
						// Entry-point for `import "my-package"` in ESM
						import: {
							// Where TypeScript will look.
							types: "./types/esm/index.d.ts",
							// Where Node.js will look.
							default: "./esm/index.js",
						},
						// Entry-point for `require("my-package") in CJS
						require: {
							// Where TypeScript will look.
							types: "./types/commonjs/index.d.cts",
							// Where Node.js will look.
							default: "./commonjs/index.cjs",
						},
					},
				},
				// Fall-back for older versions of TypeScript
				types: "./types/index.d.ts",
				// CJS fall-back for older versions of Node.js
				main: "./commonjs/index.cjs",
			},
			".",
		),
	).resolves.toBe("./types/esm/index.d.ts");
});

// https://www.typescriptlang.org/docs/handbook/modules/reference.html#example-explicit-types-condition
test("ts module handbook explicit types", async () => {
	await expect(
		_packageTypes(
			{
				name: "pkg",
				exports: {
					"./subpath": {
						import: {
							types: "./types/subpath/index.d.mts",
							default: "./es/subpath/index.mjs",
						},
						require: {
							types: "./types/subpath/index.d.cts",
							default: "./cjs/subpath/index.cjs",
						},
					},
				},
			},
			"subpath",
		),
	).resolves.toBe("./types/subpath/index.d.mts");
});

// https://www.typescriptlang.org/docs/handbook/modules/reference.html#example-subpath-patterns
test("ts module handbook subpath patterns", async () => {
	await expect(
		_packageTypes(
			{
				name: "pkg",
				type: "module",
				exports: {
					"./*.js": {
						types: "./types/*.d.ts",
						default: "./dist/*.js",
					},
				},
			},
			"wildcard.js",
		),
	).resolves.toBe("./types/wildcard.d.ts");
});
