import { err, ok, Result } from "neverthrow";
import { type NormalizedPackageJson } from "read-pkg";
import { exports } from "resolve.exports";
import { PackageTypesError } from "./errors";

/**
`packageTypes` resolves the types entrypoint file (e.g., `index.d.ts`).

@param pkgJson - the contents of `package.json`
@param pkgSubpath - the selected subpath from the `exports` property of `package.json`

@internal
*/
export const packageTypes = (
  pkgJson: Partial<NormalizedPackageJson>,
  pkgSubpath: string,
): Result<string, PackageTypesError> => {
  const isRootSubpath = [".", pkgJson.name].includes(pkgSubpath);
  const resolvedTypes = resolveTypes(pkgJson, pkgSubpath);
  if (!isRootSubpath || resolvedTypes.isOk()) {
    return resolvedTypes;
  }
  if (pkgJson.types && isTypesFile(pkgJson.types)) {
    return ok(pkgJson.types);
  }
  if (pkgJson.typings && isTypesFile(pkgJson.typings)) {
    return ok(pkgJson.typings);
  }
  return err(
    new PackageTypesError(
      "no types files in `exports` field or fallback fields",
    ),
  );
};

const resolveTypes = (
  pkgJson: Partial<NormalizedPackageJson>,
  subpath: string,
): Result<string, PackageTypesError> => {
  try {
    const resolved = exports(pkgJson, subpath, {
      conditions: ["types"],
      unsafe: true,
    });
    if (!Array.isArray(resolved)) {
      return err(new PackageTypesError("resolved types are not an array"));
    }
    const resolvedPath = resolved[0];
    if (!resolvedPath || !isTypesFile(resolvedPath)) {
      return err(
        new PackageTypesError("resolved types are not a types file", {
          cause: { resolvedPath },
        }),
      );
    }
    return ok(resolvedPath);
  } catch (e) {
    return err(
      new PackageTypesError("failed to resolve types from `exports` field", {
        cause: e,
      }),
    );
  }
};

const isTypesFile = (filepath: string): boolean =>
  [".d.ts", ".d.mts", ".d.cts"].some((ext) => filepath.endsWith(ext));
