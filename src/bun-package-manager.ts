import { Effect } from "effect";
import { execa } from "execa";
import { InstallPackageError, PackageManager } from "./package-manager";

/** @internal */
export const bunPackageManager = (bunPath = "bun") =>
	PackageManager.of({
		installPackage: ({ pkg, cwd }) =>
			Effect.gen(function* (_) {
				// Run `bun add <pkg> --verbose`.
				// See https://bun.sh/docs/cli/add.
				const { stdout } = yield* _(
					Effect.tryPromise({
						try: () => execa(bunPath, ["add", pkg, "--verbose"], { cwd }),
						catch: (e) => new InstallPackageError({ cause: e }),
					}),
				);

				// With verbose output on, bun prints one line per installed package
				// (e.g., "foo@1.0.0"), including all installed dependencies.
				// These lines are between the two delimiting lines found here:
				// https://github.com/oven-sh/bun/blob/972a7b7080bd3066b54dcb43e9c91c5dfa26a69c/src/install/lockfile.zig#L5369-L5370.
				const lines = stdout.split("\n");
				const beginHash = lines.findIndex((line) => line.startsWith("-- BEGIN SHA512/256"));
				const endHash = lines.findIndex((line) => line.startsWith("-- END HASH"));
				const installedPackages = lines.slice(beginHash + 1, endHash);
				return installedPackages;
			}),
	});
