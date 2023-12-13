import { err, ok, Result } from "neverthrow";
import { type NormalizedPackageJson } from "read-pkg";
import { exports } from "resolve.exports";

export const resolveTypes = (
  pkgJson: Partial<NormalizedPackageJson>,
  pkgSubpath: string,
): Result<string, Error> => {
  const isRootSubpath = [".", pkgJson.name].includes(pkgSubpath);
  const resolvedTypes = resolveTypesExports(pkgJson, pkgSubpath).mapErr(
    (e) => new Error(`resolveTypes: failed to resolve types: ${e}`),
  );
  if (!isRootSubpath || resolvedTypes.isOk()) {
    return resolvedTypes;
  }
  if (pkgJson.types && isTypesFile(pkgJson.types)) {
    return ok(pkgJson.types);
  }
  if (pkgJson.typings && isTypesFile(pkgJson.typings)) {
    return ok(pkgJson.typings);
  }
  return err(new Error("resolveTypes: failed to resolve types"));
};

const resolveTypesExports = (
  pkgJson: Partial<NormalizedPackageJson>,
  subpath: string,
): Result<string, Error> => {
  try {
    const resolved = exports(pkgJson, subpath, {
      conditions: ["types"],
      unsafe: true,
    });
    if (!Array.isArray(resolved)) {
      return err(new Error("resolveTypesExports: not an array"));
    }
    const resolvedPath = resolved[0];
    if (!resolvedPath || !isTypesFile(resolvedPath)) {
      return err(new Error("resolveTypesExports: not a types file"));
    }
    return ok(resolvedPath);
  } catch (e) {
    return err(
      new Error(`resolveTypesExports: failed to resolve types exports: ${e}`),
    );
  }
};

const isTypesFile = (filepath: string): boolean =>
  [".d.ts", ".d.mts", ".d.cts"].some((ext) => filepath.endsWith(ext));
