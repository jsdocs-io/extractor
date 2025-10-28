import { SourceFile } from "ts-morph";
import type { FoundDeclaration } from "./extract-declarations.ts";
import { isGlobal } from "./is-global.ts";
import { isHidden } from "./is-hidden.ts";

export function globalAmbientDeclarations(
	containerName: string,
	container: SourceFile,
): FoundDeclaration[] {
	// See https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#global-variables.
	const globalCandidates = [
		...container.getVariableDeclarations(),
		...container.getFunctions(),
		...container.getModules(),
	];
	const globalAmbientDeclarations = [];
	for (const declaration of globalCandidates) {
		if (!isGlobal(declaration)) continue;
		if (isHidden(declaration)) continue;

		// Global ambient functions must have a name.
		const exportName = declaration.getName()!;
		globalAmbientDeclarations.push({ containerName, exportName, declaration });
	}
	return globalAmbientDeclarations;
}
