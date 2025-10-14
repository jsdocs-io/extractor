import { Node, SyntaxKind } from "ts-morph";
import { parseDocComment } from "./parse-doc-comment.ts";

export function docs(node: Node): string[] {
	return [
		// List of unique JSDoc comments that are closest to the node.
		...new Set(nodesWithDocs(node).flatMap((node) => lastDoc(node) ?? [])),
	];
}

function nodesWithDocs(node: Node): Node[] {
	// A node may not have a JSDoc comment directly attached to it in the AST.
	// Find the nodes that have the attached comment starting from the given node.
	if (Node.isVariableDeclaration(node)) return [node.getVariableStatementOrThrow()];
	if (Node.isExpression(node)) return [node.getParent()!];
	if (Node.isOverloadable(node) && !Node.isConstructorDeclaration(node)) {
		// Functions and class methods can be overloaded with each declaration
		// having its own doc. Since we return overloaded declarations grouped
		// into one item, we need this item to share the docs of all overloads.
		// Constructors can also be overloaded but they are excluded because
		// one item is returned per constructor each with its own docs.
		const implementation = node.getImplementation();
		return [...node.getOverloads(), ...(implementation ? [implementation] : [])];
	}
	if (
		Node.isMethodSignature(node) &&
		node.getParent().getKind() === SyntaxKind.InterfaceDeclaration
	) {
		// Treat interface methods like overloaded class methods.
		const methodName = node.getName();
		const overloads = node
			.getParentIfKindOrThrow(SyntaxKind.InterfaceDeclaration)
			.getMethods()
			.filter((method) => method.getName() === methodName);
		return overloads;
	}
	return [node];
}

function lastDoc(node: Node): string | undefined {
	// Get the JSDoc comment closest to the node.
	const doc = node.getLastChildByKind(SyntaxKind.JSDoc)?.getText();
	if (!doc) return undefined;
	if (parseDocComment(doc).modifierTagSet.isPackageDocumentation()) {
		// The first declaration after the package documentation comment
		// should not use that comment for its own documentation.
		// See `export-named-declaration-without-jsdoc.test.ts`.
		return undefined;
	}
	return doc;
}
