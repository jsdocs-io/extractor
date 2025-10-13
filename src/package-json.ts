import { Effect } from "effect";
import { readPackage } from "read-pkg";
import { PackageJsonError } from "./errors.ts";

/** `packageJson` returns an Effect for reading the `package.json` file in the given directory. */
export function packageJson(pkgDir: string) {
	return Effect.tryPromise({
		try: () => readPackage({ cwd: pkgDir }),
		catch: (err) => new PackageJsonError({ cause: err }),
	});
}
