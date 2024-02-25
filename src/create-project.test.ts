import fs from "node:fs/promises";
import { join } from "pathe";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { createProject } from "./create-project";
import { ProjectError } from "./errors";

test("no index file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    const project = createProject({
      indexFilePath: "./no-such-file.ts",
      cwd: dir,
    });
    expect(project.isErr()).toBe(true);
    expect(project._unsafeUnwrapErr() instanceof ProjectError).toBe(true);
  });
});

test("with index file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    await fs.writeFile(join(dir, "./index.ts"), "export {};");
    const project = createProject({ indexFilePath: "./index.ts", cwd: dir });
    expect(project.isOk()).toBe(true);
    expect(
      project
        ._unsafeUnwrap()
        .project.getSourceFiles()
        .map((sf) => sf.getBaseName()),
    ).toStrictEqual(["index.ts"]);
  });
});

test("with index file and other file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    await fs.writeFile(join(dir, "./index.ts"), "export * from './other';");
    await fs.writeFile(join(dir, "./other.ts"), "export const a = 1;");
    const project = createProject({ indexFilePath: "./index.ts", cwd: dir });
    expect(project.isOk()).toBe(true);
    expect(
      project
        ._unsafeUnwrap()
        .project.getSourceFiles()
        .map((sf) => sf.getBaseName()),
    ).toStrictEqual(["index.ts", "other.ts"]);
  });
});
