import { Result, err, ok } from "neverthrow";
import validate from "validate-npm-package-name";

export const packageName = (pkg: string): Result<string, Error> => {
  const versionMarker = pkg.lastIndexOf("@");
  const name = pkg.slice(0, versionMarker > 0 ? versionMarker : undefined);
  if (validate(name).validForNewPackages) {
    return ok(name);
  }
  return err(new Error(`packageName: invalid package name: ${name}`));
};
