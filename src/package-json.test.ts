import { Effect } from "effect";
import fs from "node:fs/promises";
import { join } from "pathe";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { packageJson } from "./package-json.ts";

function _packageJson(pkgDir: string) {
	return Effect.runPromise(packageJson(pkgDir));
}

test("no package.json", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await expect(_packageJson(dir)).rejects.toThrow();
	});
});

test("with empty package.json", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await fs.writeFile(join(dir, "package.json"), "{}");
		await expect(_packageJson(dir)).resolves.toMatchInlineSnapshot(`
			{
			  "_id": "@",
			  "name": "",
			  "readme": "ERROR: No README data found!",
			  "version": "",
			}
		`);
	});
});

test("with minimal package.json", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await fs.writeFile(join(dir, "package.json"), '{ "name": "foo", "version": "1.0.0" }');
		await expect(_packageJson(dir)).resolves.toMatchInlineSnapshot(`
      {
        "_id": "foo@1.0.0",
        "name": "foo",
        "readme": "ERROR: No README data found!",
        "version": "1.0.0",
      }
    `);
	});
});

test("with minimal scoped package.json", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await fs.writeFile(join(dir, "package.json"), '{ "name": "@foo/bar", "version": "1.0.0" }');
		await expect(_packageJson(dir)).resolves.toMatchInlineSnapshot(`
			{
			  "_id": "@foo/bar@1.0.0",
			  "name": "@foo/bar",
			  "readme": "ERROR: No README data found!",
			  "version": "1.0.0",
			}
		`);
	});
});

test("with package.json from workdir with npm package", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await fs.writeFile(join(dir, "package.json"), '{ "dependencies": { "foo": "1.0.0" } }');
		await expect(_packageJson(dir)).resolves.toMatchInlineSnapshot(`
			{
			  "_id": "@",
			  "dependencies": {
			    "foo": "1.0.0",
			  },
			  "name": "",
			  "readme": "ERROR: No README data found!",
			  "version": "",
			}
		`);
	});
});

test("with package.json from workdir with scoped npm package", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await fs.writeFile(join(dir, "package.json"), '{ "dependencies": { "@foo/bar": "^1.0.0" } }');
		await expect(_packageJson(dir)).resolves.toMatchInlineSnapshot(`
			{
			  "_id": "@",
			  "dependencies": {
			    "@foo/bar": "^1.0.0",
			  },
			  "name": "",
			  "readme": "ERROR: No README data found!",
			  "version": "",
			}
		`);
	});
});

test("with package.json from workdir with local package", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await fs.writeFile(
			join(dir, "package.json"),
			'{ "dependencies": { "foo": "/path/to/tarball.tgz" } }',
		);
		await expect(_packageJson(dir)).resolves.toMatchInlineSnapshot(`
			{
			  "_id": "@",
			  "dependencies": {
			    "foo": "/path/to/tarball.tgz",
			  },
			  "name": "",
			  "readme": "ERROR: No README data found!",
			  "version": "",
			}
		`);
	});
});

test("with package.json from workdir with local scoped package", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await fs.writeFile(
			join(dir, "package.json"),
			'{ "dependencies": { "@foo/bar": "/path/to/tarball.tgz" } }',
		);
		await expect(_packageJson(dir)).resolves.toMatchInlineSnapshot(`
			{
			  "_id": "@",
			  "dependencies": {
			    "@foo/bar": "/path/to/tarball.tgz",
			  },
			  "name": "",
			  "readme": "ERROR: No README data found!",
			  "version": "",
			}
		`);
	});
});
