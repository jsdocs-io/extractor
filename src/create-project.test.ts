import fs from "node:fs/promises";
import { join } from "pathe";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { createProject } from "./create-project";
import { ProjectError } from "./errors";

test("no index file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    const project = createProject("./no-such-file.ts", dir);
    expect(project.isErr()).toBe(true);
    expect(project._unsafeUnwrapErr() instanceof ProjectError).toBe(true);
  });
});

test("with index file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    await fs.writeFile(join(dir, "./index.ts"), "export {};");
    const project = createProject("./index.ts", dir);
    expect(project.isOk()).toBe(true);
    expect(
      project._unsafeUnwrap().sourceFiles.map((sf) => sf.getBaseName()),
    ).toStrictEqual(["index.ts"]);
  });
});

test("with index file and other file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    await fs.writeFile(join(dir, "./index.ts"), "export * from './other';");
    await fs.writeFile(join(dir, "./other.ts"), "export const a = 1;");
    const project = createProject("./index.ts", dir);
    expect(project.isOk()).toBe(true);
    expect(
      project._unsafeUnwrap().sourceFiles.map((sf) => sf.getBaseName()),
    ).toStrictEqual(["index.ts", "other.ts"]);
  });
});
