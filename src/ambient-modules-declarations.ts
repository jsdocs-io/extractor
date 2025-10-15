import { Node, type Project } from "ts-morph";
import { isHidden } from "./is-hidden.ts";
import { sourceFilePath } from "./source-file-path.ts";
import type { FoundDeclaration } from "./types.ts";

export function ambientModulesDeclarations(
	containerName: string,
	project: Project,
	pkgName?: string,
): FoundDeclaration[] {
	const ambientModulesDeclarations = [];
	for (const symbol of project.getAmbientModules()) {
		for (const declaration of symbol.getDeclarations()) {
			if (!Node.isModuleDeclaration(declaration) || isHidden(declaration)) continue;

			// Ignore ambient modules that are not from the analyzed package.
			if (pkgName && !sourceFilePath(declaration).startsWith(`/${pkgName}`)) continue;

			const exportName = declaration.getName();
			ambientModulesDeclarations.push({ containerName, exportName, declaration });
		}
	}
	return ambientModulesDeclarations;
}
