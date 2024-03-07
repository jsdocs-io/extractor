import { Data, Effect } from "effect";
import { readPackage } from "read-pkg";

/** @internal */
export class PackageJsonError extends Data.TaggedError("PackageJsonError")<{
	cause?: unknown;
}> {}

/** @internal */
export const packageJson = (pkgDir: string) =>
	Effect.tryPromise({
		try: () => readPackage({ cwd: pkgDir }),
		catch: (e) => new PackageJsonError({ cause: e }),
	});
