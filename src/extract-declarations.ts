import { orderBy } from "natural-orderby";
import { Node, type ExportedDeclarations } from "ts-morph";
import { ambientModulesDeclarations } from "./ambient-modules-declarations.ts";
import { exportEqualsDeclarations } from "./export-equals-declarations.ts";
import { exportedDeclarations } from "./exported-declarations.ts";
import { extractClass } from "./extract-class.ts";
import { extractEnum } from "./extract-enum.ts";
import { extractExpression } from "./extract-expression.ts";
import { extractFileModule } from "./extract-file-module.ts";
import { extractFunctionExpression } from "./extract-function-expression.ts";
import { extractFunction } from "./extract-function.ts";
import { extractInterface } from "./extract-interface.ts";
import { extractNamespace } from "./extract-namespace.ts";
import { extractTypeAlias } from "./extract-type-alias.ts";
import { extractVariableAssignmentExpression } from "./extract-variable-assignment-expression.ts";
import { extractVariable } from "./extract-variable.ts";
import { globalAmbientDeclarations } from "./global-ambient-declarations.ts";
import { id } from "./id.ts";
import { isClass } from "./is-class.ts";
import { isEnum } from "./is-enum.ts";
import { isExpression } from "./is-expression.ts";
import { isFileModule } from "./is-file-module.ts";
import { isFunctionExpression } from "./is-function-expression.ts";
import { isFunction } from "./is-function.ts";
import { isInterface } from "./is-interface.ts";
import { isNamespace } from "./is-namespace.ts";
import { isTypeAlias } from "./is-type-alias.ts";
import { isVariableAssignmentExpression } from "./is-variable-assignment-expression.ts";
import { isVariable } from "./is-variable.ts";
import type { ExtractDeclarationsOptions, ExtractedDeclaration } from "./types.ts";

/**
`extractDeclarations` extracts the top-level declarations
found in a container and/or a project.

@param options - {@link ExtractDeclarationsOptions}

@internal
*/
export const extractDeclarations = async ({
	containerName,
	container,
	maxDepth,
	project,
	pkgName,
}: ExtractDeclarationsOptions): Promise<ExtractedDeclaration[]> => {
	const foundDeclarations = [
		...exportedDeclarations(containerName, container),
		...exportEqualsDeclarations(containerName, container),
		...(project ? ambientModulesDeclarations(containerName, project, pkgName) : []),
		...(Node.isSourceFile(container) ? globalAmbientDeclarations(containerName, container) : []),
	];
	const seenFunctions = new Set<string>();
	const seenNamespaces = new Set<string>();
	const extractedDeclarations = [];
	for (const { containerName, exportName, declaration } of foundDeclarations) {
		const extractedDeclaration = await extractDeclaration({
			containerName,
			exportName,
			declaration,
			maxDepth,
			seenFunctions,
			seenNamespaces,
		});
		if (!extractedDeclaration) {
			continue;
		}
		extractedDeclarations.push(extractedDeclaration);
	}
	return orderBy(extractedDeclarations, "id");
};

type ExtractDeclarationOptions = {
	containerName: string;
	exportName: string;
	declaration: ExportedDeclarations;
	maxDepth: number;
	seenFunctions: Set<string>;
	seenNamespaces: Set<string>;
};

const extractDeclaration = async ({
	containerName,
	exportName,
	declaration,
	maxDepth,
	seenFunctions,
	seenNamespaces,
}: ExtractDeclarationOptions): Promise<ExtractedDeclaration | undefined> => {
	if (isVariable(declaration)) {
		return await extractVariable(containerName, exportName, declaration);
	}
	if (isVariableAssignmentExpression(declaration)) {
		return await extractVariableAssignmentExpression(containerName, exportName, declaration);
	}
	if (isExpression(declaration)) {
		return await extractExpression(containerName, exportName, declaration);
	}
	if (isFunction(declaration)) {
		if (seenFunctions.has(exportName)) {
			// Skip function overloads, since an extracted function already contains
			// the docs and signatures of the implementation and all the overloads.
			return undefined;
		}
		seenFunctions.add(exportName);
		return await extractFunction(containerName, exportName, declaration);
	}
	if (isFunctionExpression(declaration)) {
		return await extractFunctionExpression(containerName, exportName, declaration);
	}
	if (isClass(declaration)) {
		return await extractClass(containerName, exportName, declaration);
	}
	if (isInterface(declaration)) {
		return await extractInterface(containerName, exportName, declaration);
	}
	if (isEnum(declaration)) {
		return await extractEnum(containerName, exportName, declaration);
	}
	if (isTypeAlias(declaration)) {
		return await extractTypeAlias(containerName, exportName, declaration);
	}
	if (isNamespace(declaration) && maxDepth > 0) {
		if (seenNamespaces.has(exportName)) {
			// Skip merged or nested namespaces, since an extracted namespace already
			// contains all the declarations found in the same namespace.
			return undefined;
		}
		seenNamespaces.add(exportName);
		const innerDeclarations = await extractDeclarations({
			containerName: id(containerName, "+namespace", exportName),
			container: declaration,
			maxDepth: maxDepth - 1,
		});
		return await extractNamespace(containerName, exportName, declaration, innerDeclarations);
	}
	if (isFileModule(declaration) && maxDepth > 0) {
		// A file module declaration happens with the following export forms:
		// `import * as ns from module; export { ns };` or
		// `export * as ns from module`.
		const innerDeclarations = await extractDeclarations({
			containerName: id(containerName, "+namespace", exportName),
			container: declaration,
			maxDepth: maxDepth - 1,
		});
		return await extractFileModule(containerName, exportName, declaration, innerDeclarations);
	}
	return undefined;
};
