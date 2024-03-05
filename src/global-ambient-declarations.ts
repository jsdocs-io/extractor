import {
	SourceFile,
	type FunctionDeclaration,
	type ModuleDeclaration,
	type VariableDeclaration,
} from "ts-morph";
import { isGlobal } from "./is-global";
import { isHidden } from "./is-hidden";

export type GlobalAmbientDeclarationsReturn = {
	containerName: string;
	exportName: string;
	declaration: VariableDeclaration | FunctionDeclaration | ModuleDeclaration;
}[];

export const globalAmbientDeclarations = (
	containerName: string,
	container: SourceFile,
): GlobalAmbientDeclarationsReturn => {
	// See https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#global-variables.
	const globalCandidates = [
		...container.getVariableDeclarations(),
		...container.getFunctions(),
		...container.getModules(),
	];
	const globalAmbientDeclarations = [];
	for (const declaration of globalCandidates) {
		if (isHidden(declaration) || !isGlobal(declaration)) {
			continue;
		}
		globalAmbientDeclarations.push({
			containerName,
			// Global ambient functions must have a name.
			exportName: declaration.getName()!,
			declaration,
		});
	}
	return globalAmbientDeclarations;
};
