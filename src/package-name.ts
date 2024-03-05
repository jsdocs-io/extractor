import { Effect } from "effect";
import validate from "validate-npm-package-name";

/** @internal */
export class PackageNameError {
	readonly _tag = "PackageNameError";
}

/** @internal */
export const packageName = (pkg: string) =>
	Effect.suspend(() => {
		const versionMarker = pkg.lastIndexOf("@");
		const name = pkg.slice(0, versionMarker > 0 ? versionMarker : undefined);
		if (!validate(name).validForNewPackages) {
			return Effect.fail(new PackageNameError());
		}
		return Effect.succeed(name);
	});
