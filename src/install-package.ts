import { execa } from "execa";
import { ResultAsync } from "neverthrow";
import { InstallPackageError } from "./errors";

export const installPackage = (
  pkg: string,
): ResultAsync<string[], InstallPackageError> =>
  ResultAsync.fromPromise(
    execa("bun", ["add", pkg, "--verbose"]),
    (e) => new InstallPackageError("failed to install package", { cause: e }),
  ).map(({ stdout }) => {
    // With verbose output on, bun prints one line per installed package
    // (for example, "foo@1.0.0"), including all installed dependencies.
    // These lines are between the two delimiting lines found here:
    // https://github.com/oven-sh/bun/blob/972a7b7080bd3066b54dcb43e9c91c5dfa26a69c/src/install/lockfile.zig#L5369-L5370.
    const lines = stdout.split("\n");
    const beginHash = lines.findIndex((line) =>
      line.startsWith("-- BEGIN SHA512/256"),
    );
    const endHash = lines.findIndex((line) => line.startsWith("-- END HASH"));
    const installedPackages = lines.slice(beginHash + 1, endHash);
    return installedPackages;
  });
