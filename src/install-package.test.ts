import { Effect } from "effect";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { installPackage, type InstallPackageOptions } from "./install-package";

const _installPackage = (options: InstallPackageOptions) =>
  Effect.runPromise(installPackage(options));

test("invalid package", async () => {
  await temporaryDirectoryTask(async (dir) => {
    await expect(_installPackage({ pkg: "", cwd: dir })).rejects.toThrow();
  });
});

test("package with no production dependencies", async () => {
  await temporaryDirectoryTask(async (dir) => {
    await expect(
      _installPackage({ pkg: "verify-hcaptcha@1.0.0", cwd: dir }),
    ).resolves.toStrictEqual(["verify-hcaptcha@1.0.0"]);
  });
});

test("package with some production dependencies", async () => {
  await temporaryDirectoryTask(async (dir) => {
    await expect(
      _installPackage({ pkg: "query-registry@2.6.0", cwd: dir }),
    ).resolves.toContain("query-registry@2.6.0");
  });
});
