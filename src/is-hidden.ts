import { Node, SyntaxKind } from "ts-morph";
import { docs } from "./docs";
import { parseDocComment } from "./parse-doc-comment";

export const isHidden = (node: Node): boolean =>
	// Check if a declaration is part of a package's private API.
	isPrivateProperty(node) || hasPrivateModifier(node) || hasInternalTag(node);

const isPrivateProperty = (node: Node): boolean =>
	// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties.
	Node.hasName(node) && Node.isPrivateIdentifier(node.getNameNode());

const hasPrivateModifier = (node: Node): boolean =>
	// See https://www.typescriptlang.org/docs/handbook/2/classes.html#private.
	Node.isModifierable(node) && node.hasModifier(SyntaxKind.PrivateKeyword);

const hasInternalTag = (node: Node): boolean =>
	// See https://tsdoc.org/pages/tags/internal.
	docs(node).some((doc) => parseDocComment(doc).modifierTagSet.isInternal());
