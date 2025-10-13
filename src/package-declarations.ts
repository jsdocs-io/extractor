import { Effect } from "effect";
import { PackageDeclarationsError } from "./errors.ts";
import { extractDeclarations } from "./extract-declarations.ts";
import type { PackageDeclarationsOptions } from "./types.ts";

/** `packageDeclarations` returns an Effect that extracts declarations from a package. */
export function packageDeclarations({
	pkgName,
	project,
	indexFile,
	maxDepth,
}: PackageDeclarationsOptions) {
	return Effect.tryPromise({
		try: () =>
			extractDeclarations({
				containerName: "",
				container: indexFile,
				maxDepth,
				project,
				pkgName,
			}),
		catch: (err) => new PackageDeclarationsError({ cause: err }),
	});
}
