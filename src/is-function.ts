import { ArrowFunction, FunctionDeclaration, Node } from "ts-morph";

export const isFunction = (
	node: Node,
): node is FunctionDeclaration | ArrowFunction =>
	Node.isFunctionDeclaration(node) || Node.isArrowFunction(node);
