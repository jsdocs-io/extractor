import { expect, test } from "vitest";
import { getPackageTypes } from "./get-package-types.ts";

test("empty package.json", () => {
	expect(getPackageTypes({ pkgJson: {} })).toBeUndefined();
	expect(getPackageTypes({ pkgJson: {}, subpath: "." })).toBeUndefined();
	expect(getPackageTypes({ pkgJson: {}, subpath: "" })).toBeUndefined();
});

test("not a valid TypeScript type definitions file", () => {
	expect(
		getPackageTypes({
			pkgJson: { types: "foo.wrong.ext" },
		}),
	).toBeUndefined();
});

test("subpath not found", () => {
	expect(
		getPackageTypes({
			pkgJson: { name: "foo", exports: { ".": { types: "index.d.ts" } } },
			subpath: "bar",
		}),
	).toBeUndefined();
});

test("types from exports map for implicit root `.` subpath", () => {
	expect(
		getPackageTypes({
			pkgJson: { name: "foo", exports: { ".": { types: "index.d.ts" } } },
		}),
	).toBe("index.d.ts");
});

test("types from exports map for root `.` subpath", () => {
	expect(
		getPackageTypes({
			pkgJson: { name: "foo", exports: { ".": { types: "index.d.ts" } } },
			subpath: ".",
		}),
	).toBe("index.d.ts");
});

test("types from exports map for root `foo` package name subpath", () => {
	expect(
		getPackageTypes({
			pkgJson: { name: "foo", exports: { ".": { types: "index.d.ts" } } },
			subpath: "foo",
		}),
	).toBe("index.d.ts");
});

test("types from `custom` subpath", () => {
	expect(
		getPackageTypes({
			pkgJson: {
				name: "foo",
				exports: {
					".": { types: "index.d.ts" },
					"./custom": { types: "custom.d.ts" },
				},
			},
			subpath: "custom",
		}),
	).toBe("custom.d.ts");
});

test("types from `package.json/#types` fallback", () => {
	expect(
		getPackageTypes({
			pkgJson: { types: "index.d.ts" },
			subpath: ".",
		}),
	).toBe("index.d.ts");
});

test("types from `package.json/#typings` fallback", () => {
	expect(
		getPackageTypes({
			pkgJson: { typings: "index.d.ts" },
			subpath: ".",
		}),
	).toBe("index.d.ts");
});

test("types from `package.json/#types` fallback and not from `default` condition for root subpath", () => {
	expect(
		getPackageTypes({
			pkgJson: {
				name: "foo",
				types: "index.d.ts",
				exports: {
					".": { default: "index.js" },
				},
			},
			subpath: ".",
		}),
	).toBe("index.d.ts");
});

test("types not from `package.json/#types` fallback if not root subpath", () => {
	expect(
		getPackageTypes({
			pkgJson: {
				name: "foo",
				types: "index.d.ts",
				exports: {
					".": { default: "index.js" },
				},
			},
			subpath: "custom",
		}),
	).toBeUndefined();
});

test("types not from `package.json/#typings` fallback if not root subpath", () => {
	expect(
		getPackageTypes({
			pkgJson: {
				name: "foo",
				typings: "index.d.ts",
				exports: {
					".": { default: "index.js" },
				},
			},
			subpath: "custom",
		}),
	).toBeUndefined();
});

test("ts-api-utils@2.1.0", () => {
	expect(
		getPackageTypes({
			pkgJson: {
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
			subpath: ".",
		}),
	).toBe("./lib/index.d.ts");
});

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#packagejson-exports-imports-and-self-referencing
test("ts 4.7 release", () => {
	expect(
		getPackageTypes({
			pkgJson: {
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
			subpath: ".",
		}),
	).toBe("./types/esm/index.d.ts");
});

// https://www.typescriptlang.org/docs/handbook/modules/reference.html#example-explicit-types-condition
test("ts module handbook explicit types", () => {
	expect(
		getPackageTypes({
			pkgJson: {
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
			subpath: "subpath",
		}),
	).toBe("./types/subpath/index.d.mts");
});

// https://www.typescriptlang.org/docs/handbook/modules/reference.html#example-subpath-patterns
test("ts module handbook subpath patterns", () => {
	expect(
		getPackageTypes({
			pkgJson: {
				name: "pkg",
				type: "module",
				exports: {
					"./*.js": {
						types: "./types/*.d.ts",
						default: "./dist/*.js",
					},
				},
			},
			subpath: "wildcard.js",
		}),
	).toBe("./types/wildcard.d.ts");
});
