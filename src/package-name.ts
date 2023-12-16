import { Result, err, ok } from "neverthrow";
import validate from "validate-npm-package-name";
import { InvalidPackageNameError } from "./errors";

export const packageName = (pkg: string): Result<string, Error> => {
  const versionMarker = pkg.lastIndexOf("@");
  const name = pkg.slice(0, versionMarker > 0 ? versionMarker : undefined);
  if (validate(name).validForNewPackages) {
    return ok(name);
  }
  return err(
    new InvalidPackageNameError("invalid name for npm package", {
      cause: { name },
    }),
  );
};
