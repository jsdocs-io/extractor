import {
	type ArrowFunction,
	type BinaryExpression,
	type ClassDeclaration,
	type EnumDeclaration,
	type Expression,
	type FunctionDeclaration,
	type InterfaceDeclaration,
	type ModuleDeclaration,
	Node,
	type SourceFile,
	SyntaxKind,
	type TypeAliasDeclaration,
	type VariableDeclaration,
} from "ts-morph";

export function isVariable(node: Node): node is VariableDeclaration {
	return Node.isVariableDeclaration(node) && !isFunctionExpression(node);
}

export function isVariableAssignmentExpression(node: Node): node is BinaryExpression {
	return Node.isBinaryExpression(node) && Node.isIdentifier(node.getLeft());
}

export function isExpression(node: Node): node is Expression {
	return Node.isExpression(node) && !Node.isArrowFunction(node);
}

export function isFunction(node: Node): node is FunctionDeclaration | ArrowFunction {
	return Node.isFunctionDeclaration(node) || Node.isArrowFunction(node);
}

export function isFunctionExpression(node: Node): node is VariableDeclaration {
	if (!Node.isVariableDeclaration(node)) return false;

	// Check type signature after `:` (e.g., `const foo: () => void;`).
	if (node.getTypeNode()?.getKind() === SyntaxKind.FunctionType) return true;

	const initializer = node.getInitializer();
	if (!initializer) return false;
	return Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer);
}

export function isClass(node: Node): node is ClassDeclaration {
	return Node.isClassDeclaration(node);
}

export function isInterface(node: Node): node is InterfaceDeclaration {
	return Node.isInterfaceDeclaration(node);
}

export function isEnum(node: Node): node is EnumDeclaration {
	return Node.isEnumDeclaration(node);
}

export function isTypeAlias(node: Node): node is TypeAliasDeclaration {
	return Node.isTypeAliasDeclaration(node);
}

export function isNamespace(node: Node): node is ModuleDeclaration {
	return Node.isModuleDeclaration(node);
}

export function isFileModule(node: Node): node is SourceFile {
	return Node.isSourceFile(node);
}
