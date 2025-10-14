import { Node, type ExportedDeclarations } from "ts-morph";

export function isExportedDeclarations(node: Node): node is ExportedDeclarations {
	return (
		Node.isVariableDeclaration(node) ||
		Node.isFunctionDeclaration(node) ||
		Node.isClassDeclaration(node) ||
		Node.isInterfaceDeclaration(node) ||
		Node.isEnumDeclaration(node) ||
		Node.isTypeAliasDeclaration(node) ||
		Node.isModuleDeclaration(node) ||
		Node.isExpression(node) ||
		Node.isSourceFile(node)
	);
}
