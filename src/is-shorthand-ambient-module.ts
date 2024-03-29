import { Node, type ModuleDeclaration } from "ts-morph";

export const isShorthandAmbientModule = (node: Node): node is ModuleDeclaration =>
	// Shorthand ambient modules have no body (e.g., `declare module 'foo';`)
	// and their name includes the quotes (e.g., name === "'foo'").
	Node.isModuleDeclaration(node) && !node.hasBody();
