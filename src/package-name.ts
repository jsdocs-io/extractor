import { Result, err, ok } from "neverthrow";
import validate from "validate-npm-package-name";
import { PackageNameError } from "./errors";

export const packageName = (pkg: string): Result<string, PackageNameError> => {
  const versionMarker = pkg.lastIndexOf("@");
  const name = pkg.slice(0, versionMarker > 0 ? versionMarker : undefined);
  if (validate(name).validForNewPackages) {
    return ok(name);
  }
  return err(
    new PackageNameError("invalid npm package name", { cause: { name } }),
  );
};
