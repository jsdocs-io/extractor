import { Node, type ModuleDeclaration } from "ts-morph";

export const isNamespace = (node: Node): node is ModuleDeclaration =>
	Node.isModuleDeclaration(node);
