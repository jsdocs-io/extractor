import { SyntaxKind, type ModifierableNode } from "ts-morph";

export function modifiersText(node: ModifierableNode): string {
	return node
		.getModifiers()
		.filter((modifier) => modifier.getKind() !== SyntaxKind.PublicKeyword)
		.map((modifier) => modifier.getText())
		.join(" ");
}
