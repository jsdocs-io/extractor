import { goTry } from "go-go-try";
import fs from "node:fs/promises";
import { join } from "pathe";
import { expect, test } from "vitest";
import { getProject } from "./get-project.ts";
import { tempDir } from "./temp-dir.ts";

test("no cwd", async () => {
	await using dir = await tempDir();
	const [err, _] = goTry(() =>
		getProject({
			indexFilePath: "./this-file-does-not-exist.ts",
			typeRoots: join(dir.path, "this-dir-does-not-exist"),
		}),
	);
	expect(err).toBeDefined();
});

test("no index file", async () => {
	await using dir = await tempDir();
	const [err, _] = goTry(() =>
		getProject({
			indexFilePath: "./this-file-does-not-exist.ts",
			typeRoots: dir.path,
		}),
	);
	expect(err).toBeDefined();
});

test("with index file", async () => {
	await using dir = await tempDir();
	const indexFilePath = join(dir.path, "./index.ts");
	await fs.writeFile(indexFilePath, "export {};");
	const [err, res] = goTry(() =>
		getProject({
			indexFilePath,
			typeRoots: dir.path,
		}),
	);
	expect(err).toBeUndefined();
	expect(res).toBeDefined();
	expect(res!.project.getSourceFiles().map((sf) => sf.getBaseName())).toStrictEqual(["index.ts"]);
});

test("with index file and other file", async () => {
	await using dir = await tempDir();
	const indexFilePath = join(dir.path, "./index.ts");
	const otherFilePath = join(dir.path, "./other.ts");
	await fs.writeFile(indexFilePath, "export * from './other';");
	await fs.writeFile(otherFilePath, "export const a = 1;");
	const [err, res] = goTry(() =>
		getProject({
			indexFilePath,
			typeRoots: dir.path,
		}),
	);
	expect(err).toBeUndefined();
	expect(res).toBeDefined();
	expect(res!.project.getSourceFiles().map((sf) => sf.getBaseName())).toStrictEqual([
		"index.ts",
		"other.ts",
	]);
});
