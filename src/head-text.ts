import {
	EnumDeclaration,
	SyntaxKind,
	type ClassDeclaration,
	type InterfaceDeclaration,
} from "ts-morph";

export function headText(
	declaration: ClassDeclaration | InterfaceDeclaration | EnumDeclaration,
): string {
	const parts = [];
	for (const node of declaration.getChildren()) {
		// Ignore JSDoc comments.
		if (node.getKind() === SyntaxKind.JSDoc) continue;

		// Stop at body start, marked by the first `{`
		// found in a class, interface, or enum declaration.
		if (node.getKind() === SyntaxKind.OpenBraceToken) break;

		// Get node as text.
		parts.push(node.getText());
	}
	parts.push("{}");
	return parts.join(" ");
}
