import { Effect } from "effect";
import fs from "node:fs/promises";
import { join } from "pathe";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { createProject, type CreateProjectOptions } from "./create-project";

const _createProject = (options: CreateProjectOptions) => Effect.runPromise(createProject(options));

test("no cwd", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await expect(
			_createProject({
				indexFilePath: "./this-file-does-not-exist.ts",
				cwd: join(dir, "this-dir-does-not-exist"),
			}),
		).rejects.toThrow();
	});
});

test("no index file", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await expect(
			_createProject({
				indexFilePath: "./this-file-does-not-exist.ts",
				cwd: dir,
			}),
		).rejects.toThrow();
	});
});

test("with index file", async () => {
	await temporaryDirectoryTask(async (dir) => {
		const indexFilePath = join(dir, "./index.ts");
		await fs.writeFile(indexFilePath, "export {};");
		const { project } = await _createProject({ indexFilePath, cwd: dir });
		expect(project.getSourceFiles().map((sf) => sf.getBaseName())).toStrictEqual(["index.ts"]);
	});
});

test("with index file and other file", async () => {
	await temporaryDirectoryTask(async (dir) => {
		const indexFilePath = join(dir, "./index.ts");
		const otherFilePath = join(dir, "./other.ts");
		await fs.writeFile(indexFilePath, "export * from './other';");
		await fs.writeFile(otherFilePath, "export const a = 1;");
		const { project } = await _createProject({ indexFilePath, cwd: dir });
		expect(project.getSourceFiles().map((sf) => sf.getBaseName())).toStrictEqual([
			"index.ts",
			"other.ts",
		]);
	});
});
