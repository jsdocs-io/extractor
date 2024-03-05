import type {
	ExportedDeclarations,
	ModuleDeclaration,
	SourceFile,
} from "ts-morph";
import { isExportedDeclarations } from "./is-exported-declarations";
import { isHidden } from "./is-hidden";

export type ExportedDeclarationsReturn = {
	containerName: string;
	exportName: string;
	declaration: ExportedDeclarations;
}[];

export const exportedDeclarations = (
	containerName: string,
	container: SourceFile | ModuleDeclaration,
): ExportedDeclarationsReturn => {
	const exportedDeclarations = [];
	for (const [
		exportName,
		declarations,
	] of container.getExportedDeclarations()) {
		for (const declaration of declarations) {
			if (isHidden(declaration) || !isExportedDeclarations(declaration)) {
				continue;
			}
			exportedDeclarations.push({ containerName, exportName, declaration });
		}
	}
	return exportedDeclarations;
};
