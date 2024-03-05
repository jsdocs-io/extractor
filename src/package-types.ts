import { Effect } from "effect";
import type { NormalizedPackageJson } from "read-pkg";
import { exports } from "resolve.exports";

/** @internal */
export class PackageTypesError {
  readonly _tag = "PackageTypesError";
}

/**
`packageTypes` resolves the types entrypoint file (e.g., `index.d.ts`).

@param pkgJson - the contents of `package.json`
@param subpath - the selected subpath from the `exports` property of `package.json`

@internal
*/
export const packageTypes = (
  pkgJson: Partial<NormalizedPackageJson>,
  subpath: string,
) =>
  Effect.gen(function* (_) {
    const resolvedPaths = yield* _(resolveExports(pkgJson, subpath));
    const firstPath = resolvedPaths[0];
    if (firstPath && isTypesFile(firstPath)) {
      return firstPath;
    }
    const isRootSubpath = [".", pkgJson.name].includes(subpath);
    if (isRootSubpath && pkgJson.types && isTypesFile(pkgJson.types)) {
      return pkgJson.types;
    }
    if (isRootSubpath && pkgJson.typings && isTypesFile(pkgJson.typings)) {
      return pkgJson.typings;
    }
    return yield* _(Effect.fail(new PackageTypesError()));
  });

const resolveExports = (
  pkgJson: Partial<NormalizedPackageJson>,
  subpath: string,
) => {
  try {
    const resolvedPaths =
      exports(pkgJson, subpath, {
        conditions: ["types"],
        unsafe: true,
      }) ?? [];
    return Effect.succeed(resolvedPaths as string[]);
  } catch {
    return Effect.succeed([]);
  }
};

const isTypesFile = (filepath: string): boolean =>
  [".d.ts", ".d.mts", ".d.cts"].some((ext) => filepath.endsWith(ext));
