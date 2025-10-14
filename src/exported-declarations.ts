import type { ModuleDeclaration, SourceFile } from "ts-morph";
import { isExportedDeclarations } from "./is-exported-declarations.ts";
import { isHidden } from "./is-hidden.ts";
import type { FoundDeclaration } from "./types.ts";

export function exportedDeclarations(
	containerName: string,
	container: SourceFile | ModuleDeclaration,
): FoundDeclaration[] {
	const exportedDeclarations = [];
	for (const [exportName, declarations] of container.getExportedDeclarations()) {
		for (const declaration of declarations) {
			if (!isExportedDeclarations(declaration)) continue;
			if (isHidden(declaration)) continue;
			exportedDeclarations.push({ containerName, exportName, declaration });
		}
	}
	return exportedDeclarations;
}
