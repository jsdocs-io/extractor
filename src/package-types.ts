import { Data, Effect } from "effect";
import type { NormalizedPackageJson } from "read-pkg";
import { exports } from "resolve.exports";

/** @internal */
export class PackageTypesError extends Data.TaggedError("PackageTypesError") {}

/**
`packageTypes` resolves the types entrypoint file (e.g., `index.d.ts`).

@param pkgJson - the contents of `package.json`
@param subpath - the selected subpath from the `exports` property of `package.json`

@internal
*/
export const packageTypes = (pkgJson: Partial<NormalizedPackageJson>, subpath: string) =>
	Effect.gen(function* () {
		const firstPath = yield* resolveExports(pkgJson, subpath);
		if (firstPath && isTypesFile(firstPath)) {
			return firstPath;
		}
		const isRootSubpath = [".", pkgJson.name].includes(subpath);
		if (isRootSubpath && pkgJson.types && isTypesFile(pkgJson.types)) {
			return pkgJson.types;
		}
		if (isRootSubpath && pkgJson.typings && isTypesFile(pkgJson.typings)) {
			return pkgJson.typings;
		}
		return yield* new PackageTypesError();
	});

const resolveExports = (pkgJson: Partial<NormalizedPackageJson>, subpath: string) => {
	try {
		const resolvedPaths =
			exports(pkgJson, subpath, {
				conditions: ["types", "import", "node"],
				unsafe: true,
			}) ?? [];
		return Effect.succeed(resolvedPaths[0] as string | undefined);
	} catch {
		return Effect.succeed(undefined);
	}
};

const isTypesFile = (filepath: string): boolean =>
	[".d.ts", ".d.mts", ".d.cts"].some((ext) => filepath.endsWith(ext));
