import { Effect } from "effect";
import validate from "validate-npm-package-name";
import { PackageNameError } from "./errors.ts";

/**
`packageName` returns an Effect for validating package names
according to the npm registry's new naming rules.
*/
export function packageName(pkg: string) {
	return Effect.gen(function* () {
		const versionMarker = pkg.lastIndexOf("@");
		const pkgName = pkg.slice(0, versionMarker > 0 ? versionMarker : undefined);
		const { validForNewPackages, warnings, errors } = validate(pkgName);
		if (!validForNewPackages) return yield* new PackageNameError({ warnings, errors });
		return pkgName;
	});
}
