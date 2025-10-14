import {
	Node,
	type FunctionDeclaration,
	type ModuleDeclaration,
	type VariableDeclaration,
} from "ts-morph";

/** `isGlobal` checks if a declaration is a global ambient declaration. */
export function isGlobal(
	node: Node,
): node is VariableDeclaration | FunctionDeclaration | ModuleDeclaration {
	const isGlobalVariable =
		Node.isVariableDeclaration(node) &&
		node.getVariableStatementOrThrow().isAmbient() &&
		!node.isExported();
	if (isGlobalVariable) return true;

	const isGlobalFunction =
		Node.isFunctionDeclaration(node) &&
		node.isAmbient() &&
		node.getName() !== undefined &&
		!node.isExported();
	if (isGlobalFunction) return true;

	const isGlobalNamespace =
		Node.isModuleDeclaration(node) &&
		node.isAmbient() &&
		!node.isExported() &&
		!node.hasModuleKeyword();
	if (isGlobalNamespace) return true;

	return false;
}
