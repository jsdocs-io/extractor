import { orderBy } from "natural-orderby";
import {
	type ExportedDeclarations,
	type ModuleDeclaration,
	Node,
	type Project,
	type SourceFile,
} from "ts-morph";
import { ambientModulesDeclarations } from "./ambient-modules-declarations.ts";
import {
	isClass,
	isEnum,
	isExpression,
	isFileModule,
	isFunction,
	isFunctionExpression,
	isInterface,
	isNamespace,
	isTypeAlias,
	isVariable,
	isVariableAssignmentExpression,
} from "./declaration-type-guards.ts";
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
import type { ExtractedDeclaration } from "./types.ts";

/** `ExtractDeclarationsOptions` contains the options for calling {@link extractDeclarations}. */
export interface ExtractDeclarationsOptions {
	/** Container that exports the top-level declarations. */
	container: SourceFile | ModuleDeclaration;

	/**
  Container name (e.g., the name of a namespace), used to generate declaration IDs.
  */
	containerName: string;

	/** Maximum extraction depth for nested namespaces. */
	maxDepth: number;

	/** Instance of a `ts-morph` `Project`, used to find ambient modules. */
	project?: Project;

	/** Name of the package being analyzed, used to filter ambient modules. */
	pkgName?: string;
}

/** `FoundDeclaration` represents a declaration found during the initial extraction process. */
export interface FoundDeclaration {
	/** Declaration container name. */
	containerName: string;

	/** Export name (may differ from the original name). */
	exportName: string;

	/** Declaration. */
	declaration: ExportedDeclarations;
}

/**
`extractDeclarations` extracts the top-level declarations
found in a container and/or a project.

@param options - {@link ExtractDeclarationsOptions}
*/
export async function extractDeclarations({
	containerName,
	container,
	maxDepth,
	project,
	pkgName,
}: ExtractDeclarationsOptions): Promise<ExtractedDeclaration[]> {
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
		if (!extractedDeclaration) continue;
		extractedDeclarations.push(extractedDeclaration);
	}
	return orderBy(extractedDeclarations, "id");
}

interface ExtractDeclarationOptions {
	containerName: string;
	exportName: string;
	declaration: ExportedDeclarations;
	maxDepth: number;
	seenFunctions: Set<string>;
	seenNamespaces: Set<string>;
}

async function extractDeclaration({
	containerName,
	exportName,
	declaration,
	maxDepth,
	seenFunctions,
	seenNamespaces,
}: ExtractDeclarationOptions): Promise<ExtractedDeclaration | undefined> {
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
}
