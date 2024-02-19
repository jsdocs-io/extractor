import { ok } from "neverthrow";
import fs from "node:fs/promises";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { PackageJsonError } from "./errors";
import { packageJson } from "./package-json";

test("no package.json", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    const res = await packageJson(dir);
    expect(res.isErr()).toBe(true);
    expect(res._unsafeUnwrapErr() instanceof PackageJsonError).toBe(true);
  });
});

test("with package.json", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    await fs.writeFile("package.json", '{ "name": "foo", "version": "1.0.0" }');
    const res = await packageJson(dir);
    expect(res).toStrictEqual(
      ok({
        _id: "foo@1.0.0",
        name: "foo",
        version: "1.0.0",
        readme: "ERROR: No README data found!",
      }),
    );
  });
});
