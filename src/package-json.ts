import { Effect } from "effect";
import { readPackage } from "read-pkg";

/** @internal */
export class PackageJsonError {
  readonly _tag = "PackageJsonError";
  constructor(readonly cause?: unknown) {}
}

/** @internal */
export const packageJson = (pkgDir: string) =>
  Effect.tryPromise({
    try: () => readPackage({ cwd: pkgDir }),
    catch: (e) => new PackageJsonError(e),
  });
