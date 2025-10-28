import type { Project, SourceFile } from "ts-morph";
import { extractDeclarations } from "./extract-declarations.ts";
import type { ExtractedDeclaration } from "./types.ts";

/** `GetPackageDeclarationsOptions` contains the options for calling {@link getPackageDeclarations}. */
export interface GetPackageDeclarationsOptions {
	/** Package name. */
	pkgName: string;

	/** `Project` created with `ts-morph`. */
	project: Project;

	/** `SourceFile` created with `ts-morph` representing the index file. */
	indexFile: SourceFile;

	/** Depth limit for the extraction. */
	maxDepth: number;
}

/** `getPackageDeclarations` extracts the declarations exported from the given project representing a package. */
export async function getPackageDeclarations({
	pkgName,
	project,
	indexFile,
	maxDepth,
}: GetPackageDeclarationsOptions): Promise<ExtractedDeclaration[]> {
	return await extractDeclarations({
		containerName: "",
		container: indexFile,
		maxDepth,
		project,
		pkgName,
	});
}
