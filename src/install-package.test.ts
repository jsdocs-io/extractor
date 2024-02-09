import { ok } from "neverthrow";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { InstallPackageError } from "./errors";
import { installPackage } from "./install-package";

test("invalid package", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    const res = await installPackage("");
    expect(res.isErr()).toBe(true);
    expect(res._unsafeUnwrapErr() instanceof InstallPackageError).toBe(true);
  });
});

test("package with no production dependencies", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    const installedPackages = await installPackage("verify-hcaptcha@1.0.0");
    expect(installedPackages).toStrictEqual(ok(["verify-hcaptcha@1.0.0"]));
  });
});

test("package with some production dependencies", async () => {
  await temporaryDirectoryTask(async (dir) => {
    process.chdir(dir);
    const installedPackages = await installPackage("query-registry@2.6.0");
    expect(installedPackages.isOk()).toBe(true);
    expect(installedPackages._unsafeUnwrap()).toContain("query-registry@2.6.0");
  });
});
