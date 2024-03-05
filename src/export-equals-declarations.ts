import {
	ModuleDeclaration,
	SourceFile,
	SyntaxKind,
	type ExportedDeclarations,
} from "ts-morph";
import { isExportedDeclarations } from "./is-exported-declarations";
import { isHidden } from "./is-hidden";
import { isNamespace } from "./is-namespace";
import { isShorthandAmbientModule } from "./is-shorthand-ambient-module";

export type ExportEqualsDeclarationsReturn = {
	containerName: string;
	exportName: string;
	declaration: Exclude<ExportedDeclarations, ModuleDeclaration>;
}[];

export const exportEqualsDeclarations = (
	containerName: string,
	container: SourceFile | ModuleDeclaration,
): ExportEqualsDeclarationsReturn => {
	if (isShorthandAmbientModule(container)) {
		// Export equals declarations may exist inside the body of ambient modules.
		// However, this is impossible for shorthand ambient modules with no body.
		return [];
	}
	const exportIdentifier = container
		.getExportAssignment((assignment) => assignment.isExportEquals())
		?.getLastChildByKind(SyntaxKind.Identifier);
	if (!exportIdentifier) {
		return [];
	}
	const exportName = exportIdentifier.getText();
	const exportEqualsDeclarations = [];
	for (const declaration of exportIdentifier.getDefinitionNodes()) {
		if (isHidden(declaration) || !isExportedDeclarations(declaration)) {
			continue;
		}
		if (isNamespace(declaration)) {
			// Skip namespaces since `exportedDeclarations()` already extracts
			// the inner declarations of an export equals namespace as
			// non-namespaced declarations belonging to the parent container.
			// See snapshot for `export-equals-function-and-namespace.test.ts`.
			continue;
		}
		exportEqualsDeclarations.push({ containerName, exportName, declaration });
	}
	return exportEqualsDeclarations;
};
