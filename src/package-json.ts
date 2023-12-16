import { ResultAsync } from "neverthrow";
import { readPackage } from "read-pkg";
import { PackageJsonError } from "./errors";

export const packageJson = (cwd: string) =>
  ResultAsync.fromPromise(
    readPackage({ cwd }),
    (e) => new PackageJsonError("failed to read package.json", { cause: e }),
  );