import { expect, test } from "vitest";
import { PackageTypesResolver } from "./package-types-resolver.ts";

test("optional subpath in constructor", () => {
	const r = new PackageTypesResolver({});
	expect(r.getTypes()).toBeUndefined();
});

test("empty package.json", () => {
	const r = new PackageTypesResolver({}, ".");
	expect(r.getTypes()).toBeUndefined();
});

test("not a TypeScript type definitions file", () => {
	const r = new PackageTypesResolver({ types: "foo.wrong.ext" }, ".");
	expect(r.getTypes()).toBeUndefined();
});

test("subpath not found", () => {
	const r = new PackageTypesResolver(
		{ name: "foo", exports: { ".": { types: "index.d.ts" } } },
		"bar",
	);
	expect(r.getTypes()).toBeUndefined();
});

test("types from exports map for implicit root `.` subpath", () => {
	const r = new PackageTypesResolver({ name: "foo", exports: { ".": { types: "index.d.ts" } } });
	expect(r.getTypes()).toBe("index.d.ts");
	expect(r.getExportsMapTypes()).toBe("index.d.ts");
});

test("types from exports map for root `.` subpath", () => {
	const r = new PackageTypesResolver(
		{ name: "foo", exports: { ".": { types: "index.d.ts" } } },
		".",
	);
	expect(r.getTypes()).toBe("index.d.ts");
	expect(r.getExportsMapTypes()).toBe("index.d.ts");
});

test("types from exports map for root `foo` package name subpath", () => {
	const r = new PackageTypesResolver(
		{ name: "foo", exports: { ".": { types: "index.d.ts" } } },
		"foo",
	);
	expect(r.getTypes()).toBe("index.d.ts");
	expect(r.getExportsMapTypes()).toBe("index.d.ts");
});

test("types from `custom` subpath", () => {
	const r = new PackageTypesResolver(
		{
			name: "foo",
			exports: {
				".": { types: "index.d.ts" },
				"./custom": { types: "custom.d.ts" },
			},
		},
		"custom",
	);
	expect(r.getTypes()).toBe("custom.d.ts");
	expect(r.getExportsMapTypes()).toBe("custom.d.ts");
});

test("types from `package.json/#types` fallback", () => {
	const r = new PackageTypesResolver({ types: "index.d.ts" }, ".");
	expect(r.getTypes()).toBe("index.d.ts");
	expect(r.getTypesOrTypings()).toBe("index.d.ts");
});

test("types from `package.json/#typings` fallback", () => {
	const r = new PackageTypesResolver({ types: "index.d.ts" }, ".");
	expect(r.getTypes()).toBe("index.d.ts");
	expect(r.getTypesOrTypings()).toBe("index.d.ts");
});

test("types from `package.json/#types` fallback and not from `default` condition for root subpath", () => {
	const r = new PackageTypesResolver(
		{
			name: "foo",
			types: "index.d.ts",
			exports: {
				".": { default: "index.js" },
			},
		},
		".",
	);
	expect(r.getTypes()).toBe("index.d.ts");
});

test("types not from `package.json/#types` fallback if not root subpath", () => {
	const r = new PackageTypesResolver(
		{
			name: "foo",
			types: "index.d.ts",
			exports: {
				".": { default: "index.js" },
			},
		},
		"custom",
	);
	expect(r.getTypes()).toBeUndefined();
});

test("types not from `package.json/#typings` fallback if not root subpath", () => {
	const r = new PackageTypesResolver(
		{
			name: "foo",
			typings: "index.d.ts",
			exports: {
				".": { default: "index.js" },
			},
		},
		"custom",
	);
	expect(r.getTypes()).toBeUndefined();
});

test("ts-api-utils@2.1.0", () => {
	const r = new PackageTypesResolver(
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
	);
	expect(r.getTypes()).toBe("./lib/index.d.ts");
});

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#packagejson-exports-imports-and-self-referencing
test("ts 4.7 release", () => {
	const r = new PackageTypesResolver(
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
	);
	expect(r.getTypes()).toBe("./types/esm/index.d.ts");
});

// https://www.typescriptlang.org/docs/handbook/modules/reference.html#example-explicit-types-condition
test("ts module handbook explicit types", () => {
	const r = new PackageTypesResolver(
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
	);
	expect(r.getTypes()).toBe("./types/subpath/index.d.mts");
});

// https://www.typescriptlang.org/docs/handbook/modules/reference.html#example-subpath-patterns
test("ts module handbook subpath patterns", () => {
	const r = new PackageTypesResolver(
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
	);
	expect(r.getTypes()).toBe("./types/wildcard.d.ts");
});
