import { $ } from "execa";
import { ResultAsync } from "neverthrow";
import { InstallPackageError } from "./errors";

export const installPackage = (pkg: string) =>
  ResultAsync.fromPromise(
    $`bun add ${pkg}`,
    (e) => new InstallPackageError("failed to install package", { cause: e }),
  );
