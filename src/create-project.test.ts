import fs from "fs-extra";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { createProject } from "./create-project";

test("no index file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    const project = createProject("./no-such-file.ts");
    expect(project.isErr()).toBe(true);
  });
});

test("with index file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile("./index.ts", "export {};");
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    expect(
      project
        ._unsafeUnwrap()
        .getSourceFiles()
        .map((sf) => sf.getBaseName()),
    ).toStrictEqual(["index.ts"]);
  });
});

test("with index file and other file", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile("./index.ts", "export * from './other';");
    await fs.writeFile("./other.ts", "export const a = 1;");
    const project = createProject("./index.ts");
    expect(project.isOk()).toBe(true);
    expect(
      project
        ._unsafeUnwrap()
        .getSourceFiles()
        .map((sf) => sf.getBaseName()),
    ).toStrictEqual(["index.ts", "other.ts"]);
  });
});
