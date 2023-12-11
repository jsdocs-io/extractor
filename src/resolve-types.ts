import type { NormalizedPackageJson } from "read-pkg";
import { exports, type Exports } from "resolve.exports";

export const resolveTypes = (
  pkgJson: Partial<NormalizedPackageJson>,
  pkgSubpath: string,
): string | undefined => {
  const isRootSubpath = [".", pkgJson.name].includes(pkgSubpath);
  return [
    resolveExportsSafe(pkgJson, pkgSubpath),
    ...(isRootSubpath ? [pkgJson.types] : []),
    ...(isRootSubpath ? [pkgJson.typings] : []),
  ].find((resolved) => resolved && isTypesFile(resolved));
};

const resolveExportsSafe = (
  pkgJson: Partial<NormalizedPackageJson>,
  subpath: string,
): string | undefined => {
  try {
    const resolved = exports(pkgJson, subpath, {
      conditions: ["types"],
      unsafe: true,
    }) as Exports.Output;
    return resolved[0];
  } catch {
    return undefined;
  }
};

const isTypesFile = (filepath: string): boolean => {
  return [".d.ts", ".d.mts", ".d.cts"].some((ext) => filepath.endsWith(ext));
};
