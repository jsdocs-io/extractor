import { Node, type InterfaceDeclaration } from "ts-morph";

export const isInterface = (node: Node): node is InterfaceDeclaration =>
	Node.isInterfaceDeclaration(node);
