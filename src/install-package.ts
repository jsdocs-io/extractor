import { $ } from "execa";
import { ResultAsync } from "neverthrow";

export const installPackage = (pkg: string) =>
  ResultAsync.fromPromise(
    $`bun add ${pkg}`,
    (e) => new Error(`installPackage: failed to install package: ${e}`),
  );
