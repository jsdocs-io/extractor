import { ResultAsync } from "neverthrow";
import { readPackage, type NormalizedPackageJson } from "read-pkg";
import { PackageJsonError } from "./errors";

export const packageJson = (
  pkgDir: string,
): ResultAsync<NormalizedPackageJson, PackageJsonError> =>
  ResultAsync.fromPromise(
    readPackage({ cwd: pkgDir }),
    (e) => new PackageJsonError("failed to read package.json", { cause: e }),
  );
