import { Data, Effect } from "effect";
import { execa } from "execa";

/** @internal */
export type InstallPackageOptions = {
	pkg: string;
	cwd: string;
	bunPath?: string;
};

/** @internal */
export class InstallPackageError extends Data.TaggedError("InstallPackageError")<{
	cause?: unknown;
}> {}

/** @internal */
export const installPackage = ({ pkg, cwd, bunPath = "bun" }: InstallPackageOptions) =>
	Effect.gen(function* (_) {
		const { stdout } = yield* _(bunAdd({ pkg, cwd, bunPath }));
		return installedPackages(stdout);
	});

const bunAdd = ({ pkg, cwd, bunPath }: Required<InstallPackageOptions>) =>
	Effect.tryPromise({
		try: () => execa(bunPath, ["add", pkg, "--verbose"], { cwd }),
		catch: (e) => new InstallPackageError({ cause: e }),
	});

const installedPackages = (stdout: string) => {
	// With verbose output on, bun prints one line per installed package
	// (for example, "foo@1.0.0"), including all installed dependencies.
	// These lines are between the two delimiting lines found here:
	// https://github.com/oven-sh/bun/blob/972a7b7080bd3066b54dcb43e9c91c5dfa26a69c/src/install/lockfile.zig#L5369-L5370.
	const lines = stdout.split("\n");
	const beginHash = lines.findIndex((line) => line.startsWith("-- BEGIN SHA512/256"));
	const endHash = lines.findIndex((line) => line.startsWith("-- END HASH"));
	const installedPackages = lines.slice(beginHash + 1, endHash);
	return installedPackages;
};
