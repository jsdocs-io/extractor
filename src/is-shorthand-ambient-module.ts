import { Node, type ModuleDeclaration } from "ts-morph";

export function isShorthandAmbientModule(node: Node): node is ModuleDeclaration {
	// Shorthand ambient modules have no body (e.g., `declare module 'foo';`)
	// and their name includes the quotes (e.g., name === "'foo'").
	return Node.isModuleDeclaration(node) && !node.hasBody();
}
