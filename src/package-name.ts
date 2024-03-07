import { Data, Effect } from "effect";
import validate from "validate-npm-package-name";

/** @internal */
export class PackageNameError extends Data.TaggedError("PackageNameError")<{
	warnings?: string[];
	errors?: string[];
}> {}

/** @internal */
export const packageName = (pkg: string) =>
	Effect.gen(function* (_) {
		const versionMarker = pkg.lastIndexOf("@");
		const pkgName = pkg.slice(0, versionMarker > 0 ? versionMarker : undefined);
		const { validForNewPackages, warnings, errors } = validate(pkgName);
		if (!validForNewPackages) {
			return yield* _(new PackageNameError({ warnings, errors }));
		}
		return pkgName;
	});
