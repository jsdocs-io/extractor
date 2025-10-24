import { exports } from "@es-joy/resolve.exports";
import { Effect } from "effect";
import type { NormalizedPackageJson } from "read-pkg";
import { PackageTypesError } from "./errors.ts";

/**
`packageTypes` returns an Effect that resolves the types entry point file (e.g., `index.d.ts`).

@param pkgJson - the contents of `package.json`
@param subpath - the selected subpath from the `exports` property of `package.json`
*/
export function packageTypes(pkgJson: Partial<NormalizedPackageJson>, subpath: string) {
	return Effect.gen(function* () {
		// Try to resolve the `package.json#/exports` map to find
		// a valid types entry point file for the given subpath.
		const firstPath = yield* resolveExports(pkgJson, subpath);
		if (firstPath && isTypesFile(firstPath)) return firstPath;

		// Try to find the `package.json#/types` (or `typings`) file
		// but accept it only to describe the types for the root subpath.
		const isRootSubpath = [".", pkgJson.name].includes(subpath);
		const pkgJsonTypes = pkgJson.types || pkgJson.typings;
		if (isRootSubpath && pkgJsonTypes && isTypesFile(pkgJsonTypes)) return pkgJsonTypes;

		// Couldn't resolve a valid types file.
		return yield* new PackageTypesError();
	});
}

function resolveExports(pkgJson: Partial<NormalizedPackageJson>, subpath: string) {
	try {
		const resolvedPaths =
			exports(pkgJson, subpath, {
				conditions: ["types", "import", "node"],
				unsafe: true,
			}) ?? [];
		return Effect.succeed(resolvedPaths.at(0));
	} catch {
		// The package may not have an `exports` map.
		return Effect.succeed(undefined);
	}
}

function isTypesFile(filepath: string): boolean {
	return [".d.ts", ".d.mts", ".d.cts"].some((ext) => filepath.endsWith(ext));
}
