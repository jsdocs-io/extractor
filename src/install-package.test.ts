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
    expect(installedPackages).toStrictEqual(
      ok([
        "builtins@5.0.1",
        "isomorphic-unfetch@3.1.0",
        "lru-cache@6.0.0",
        "make-error@1.3.6",
        "node-fetch@2.7.0",
        "query-registry@2.6.0",
        "semver@7.6.0",
        "tiny-lru@8.0.2",
        "tr46@0.0.3",
        "unfetch@4.2.0",
        "url-join@4.0.1",
        "validate-npm-package-name@4.0.0",
        "webidl-conversions@3.0.1",
        "whatwg-url@5.0.0",
        "yallist@4.0.0",
      ]),
    );
  });
});
