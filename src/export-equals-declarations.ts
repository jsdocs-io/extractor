import { ModuleDeclaration, SourceFile, SyntaxKind } from "ts-morph";
import { isNamespace } from "./declaration-type-guards.ts";
import { isExportedDeclarations } from "./is-exported-declarations.ts";
import { isHidden } from "./is-hidden.ts";
import { isShorthandAmbientModule } from "./is-shorthand-ambient-module.ts";
import type { FoundDeclaration } from "./types.ts";

export function exportEqualsDeclarations(
	containerName: string,
	container: SourceFile | ModuleDeclaration,
): FoundDeclaration[] {
	// Shorthand ambient modules have no body and thus no declarations.
	if (isShorthandAmbientModule(container)) return [];

	// Get the identifier from the export equals assignment (e.g., `export = foo`).
	const exportIdentifier = container
		.getExportAssignment((assignment) => assignment.isExportEquals())
		?.getLastChildByKind(SyntaxKind.Identifier);
	if (!exportIdentifier) return [];

	// Get the declarations linked to the exported identifier.
	const exportName = exportIdentifier.getText();
	const exportEqualsDeclarations = [];
	for (const declaration of exportIdentifier.getDefinitionNodes()) {
		if (!isExportedDeclarations(declaration) || isHidden(declaration)) continue;
		if (isNamespace(declaration)) {
			// Ignore namespaces since `exportedDeclarations()` already extracts
			// the inner declarations of an export equals namespace as
			// non-namespaced declarations belonging to the parent container.
			// See snapshot for `export-equals-function-and-namespace.test.ts`.
			continue;
		}
		exportEqualsDeclarations.push({ containerName, exportName, declaration });
	}
	return exportEqualsDeclarations;
}
