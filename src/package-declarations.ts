import { Data, Effect } from "effect";
import type { Project, SourceFile } from "ts-morph";
import { extractDeclarations } from "./extract-declarations";

export type PackageDeclarationsOptions = {
	pkgName: string;
	project: Project;
	indexFile: SourceFile;
	maxDepth: number;
};

/** @internal */
export class PackageDeclarationsError extends Data.TaggedError(
	"PackageDeclarationsError",
)<{ cause?: unknown }> {}

export const packageDeclarations = ({
	pkgName,
	project,
	indexFile,
	maxDepth,
}: PackageDeclarationsOptions) =>
	Effect.tryPromise({
		try: () =>
			extractDeclarations({
				containerName: "",
				container: indexFile,
				maxDepth,
				project,
				pkgName,
			}),
		catch: (e) => new PackageDeclarationsError({ cause: e }),
	});
