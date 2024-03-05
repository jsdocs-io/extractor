import { Node, type EnumDeclaration } from "ts-morph";

export const isEnum = (node: Node): node is EnumDeclaration =>
	Node.isEnumDeclaration(node);
