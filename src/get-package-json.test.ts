import { goTry } from "go-go-try";
import fs from "node:fs/promises";
import { join } from "pathe";
import { expect, test } from "vitest";
import { getPackageJson } from "./get-package-json.ts";
import { tempDir } from "./temp-dir.ts";

test("no package.json", async () => {
	await using dir = await tempDir();
	const [err, _] = await goTry(getPackageJson(dir.path));
	expect(err).toBeDefined();
});

test("with empty package.json", async () => {
	await using dir = await tempDir();
	await fs.writeFile(join(dir.path, "package.json"), "{}");
	const [err, pkgJson] = await goTry(getPackageJson(dir.path));
	expect(err).toBeUndefined();
	expect(pkgJson).toMatchInlineSnapshot(`
		{
		  "_id": "@",
		  "name": "",
		  "readme": "ERROR: No README data found!",
		  "version": "",
		}
	`);
});

test("with minimal package.json", async () => {
	await using dir = await tempDir();
	await fs.writeFile(join(dir.path, "package.json"), '{ "name": "foo", "version": "1.0.0" }');
	const [err, pkgJson] = await goTry(getPackageJson(dir.path));
	expect(err).toBeUndefined();
	expect(pkgJson).toMatchInlineSnapshot(`
		{
		  "_id": "foo@1.0.0",
		  "name": "foo",
		  "readme": "ERROR: No README data found!",
		  "version": "1.0.0",
		}
	`);
});

test("with minimal scoped package.json", async () => {
	await using dir = await tempDir();
	await fs.writeFile(join(dir.path, "package.json"), '{ "name": "@foo/bar", "version": "1.0.0" }');
	const [err, pkgJson] = await goTry(getPackageJson(dir.path));
	expect(err).toBeUndefined();
	expect(pkgJson).toMatchInlineSnapshot(`
		{
		  "_id": "@foo/bar@1.0.0",
		  "name": "@foo/bar",
		  "readme": "ERROR: No README data found!",
		  "version": "1.0.0",
		}
	`);
});

test("with package.json from project workdir with npm package", async () => {
	await using dir = await tempDir();
	await fs.writeFile(join(dir.path, "package.json"), '{ "dependencies": { "foo": "1.0.0" } }');
	const [err, pkgJson] = await goTry(getPackageJson(dir.path));
	expect(err).toBeUndefined();
	expect(pkgJson).toMatchInlineSnapshot(`
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

test("with package.json from project workdir with scoped npm package", async () => {
	await using dir = await tempDir();
	await fs.writeFile(
		join(dir.path, "package.json"),
		'{ "dependencies": { "@foo/bar": "^1.0.0" } }',
	);
	const [err, pkgJson] = await goTry(getPackageJson(dir.path));
	expect(err).toBeUndefined();
	expect(pkgJson).toMatchInlineSnapshot(`
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

test("with package.json from project workdir with local package", async () => {
	await using dir = await tempDir();
	await fs.writeFile(
		join(dir.path, "package.json"),
		'{ "dependencies": { "foo": "/path/to/tarball.tgz" } }',
	);
	const [err, pkgJson] = await goTry(getPackageJson(dir.path));
	expect(err).toBeUndefined();
	expect(pkgJson).toMatchInlineSnapshot(`
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

test("with package.json from project workdir with scoped local package", async () => {
	await using dir = await tempDir();
	await fs.writeFile(
		join(dir.path, "package.json"),
		'{ "dependencies": { "@foo/bar": "/path/to/tarball.tgz" } }',
	);
	const [err, pkgJson] = await goTry(getPackageJson(dir.path));
	expect(err).toBeUndefined();
	expect(pkgJson).toMatchInlineSnapshot(`
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
