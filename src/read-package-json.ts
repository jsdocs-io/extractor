import { ResultAsync } from "neverthrow";
import { readPackage } from "read-pkg";

export const readPackageJson = (cwd: string) =>
  ResultAsync.fromPromise(
    readPackage({ cwd }),
    (e) => new Error(`readPackageJson: failed to read package.json: ${e}`),
  );
