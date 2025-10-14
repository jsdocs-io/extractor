import { Node, SyntaxKind } from "ts-morph";
import { docs } from "./docs.ts";
import { parseDocComment } from "./parse-doc-comment.ts";

/** `isHidden` checks if a declaration is part of a package's private API. */
export function isHidden(node: Node): boolean {
	// JavaScript private class properties (e.g., `#foo`, `#bar() { ... }`).
	// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties.
	if (Node.hasName(node) && Node.isPrivateIdentifier(node.getNameNode())) return true;

	// TypeScript `private` keyword properties (e.g., `private foo`).
	// See https://www.typescriptlang.org/docs/handbook/2/classes.html#private.
	if (Node.isModifierable(node) && node.hasModifier(SyntaxKind.PrivateKeyword)) return true;

	// TSDoc/JSDoc comment with `@internal` tag.
	// See https://tsdoc.org/pages/tags/internal.
	if (docs(node).some((doc) => parseDocComment(doc).modifierTagSet.isInternal())) return true;

	// Not hidden, part of public API.
	return false;
}
