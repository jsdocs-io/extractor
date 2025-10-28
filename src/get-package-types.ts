import { exports } from "@es-joy/resolve.exports";
import { goTry } from "go-go-try";
import type { NormalizedPackageJson } from "read-pkg";

/** `GetPackageTypesOptions` contains the options for calling {@link getPackageTypes}. */
export interface GetPackageTypesOptions {
	/** The contents of the `package.json` file. */
	pkgJson: Partial<NormalizedPackageJson>;

	/**
	The subpath for which to resolve the `types` condition.

  @defaultValue `.` (package root)
	*/
	subpath?: string;
}

/**
`getPackageTypes` returns the TypeScript type definition file (e.g., `index.d.ts`)
that acts as the entry point for the package at the given subpath.
*/
export function getPackageTypes({
	pkgJson,
	subpath = ".",
}: GetPackageTypesOptions): string | undefined {
	subpath = subpath.trim() || ".";
	return getExportsMapTypes({ pkgJson, subpath }) ?? getTypesOrTypings({ pkgJson, subpath });
}

function getExportsMapTypes({
	pkgJson,
	subpath,
}: Required<GetPackageTypesOptions>): string | undefined {
	// Try to resolve the `exports` map in `package.json`
	// with conditions `import` and `types` enabled to find
	// a valid TypeScript type definitions file.
	const [err, entries = []] = goTry(() =>
		exports(pkgJson, subpath, {
			conditions: ["!default", "!node", "import", "types"],
		}),
	);

	// The package may not have an `exports` map.
	if (err !== undefined) return undefined;

	// Return first entry, if valid.
	const entry = entries.at(0);
	if (!entry || !isTypesFile(entry)) return undefined;
	return entry;
}

function getTypesOrTypings({
	pkgJson,
	subpath,
}: Required<GetPackageTypesOptions>): string | undefined {
	// Try to find the `package.json#/types` (or `typings`) file
	// but accept it only to describe the types for the root subpath.
	if (!isRootSubpath({ pkgJson, subpath })) return undefined;
	const entry = pkgJson.types || pkgJson.typings;
	if (!entry || !isTypesFile(entry)) return undefined;
	return entry;
}

function isRootSubpath({ pkgJson, subpath }: Required<GetPackageTypesOptions>): boolean {
	return [".", pkgJson.name].includes(subpath);
}

function isTypesFile(filename: string): boolean {
	return [".d.ts", ".d.mts", ".d.cts"].some((ext) => filename.endsWith(ext));
}
