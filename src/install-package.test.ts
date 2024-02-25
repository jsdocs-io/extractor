import { ok } from "neverthrow";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { InstallPackageError } from "./errors";
import { installPackage } from "./install-package";

test("invalid package", async () => {
  await temporaryDirectoryTask(async (dir) => {
    const res = await installPackage({ pkg: "", cwd: dir });
    expect(res.isErr()).toBe(true);
    expect(res._unsafeUnwrapErr() instanceof InstallPackageError).toBe(true);
  });
});

test("package with no production dependencies", async () => {
  await temporaryDirectoryTask(async (dir) => {
    const installedPackages = await installPackage({
      pkg: "verify-hcaptcha@1.0.0",
      cwd: dir,
    });
    expect(installedPackages).toStrictEqual(ok(["verify-hcaptcha@1.0.0"]));
  });
});

test("package with some production dependencies", async () => {
  await temporaryDirectoryTask(async (dir) => {
    const installedPackages = await installPackage({
      pkg: "query-registry@2.6.0",
      cwd: dir,
    });
    expect(installedPackages.isOk()).toBe(true);
    expect(installedPackages._unsafeUnwrap()).toContain("query-registry@2.6.0");
  });
});
