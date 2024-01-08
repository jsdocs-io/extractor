import { SyntaxKind, type ModifierableNode } from "ts-morph";

export const modifiersText = (node: ModifierableNode): string =>
  node
    .getModifiers()
    .filter((modifier) => modifier.getKind() !== SyntaxKind.PublicKeyword)
    .map((modifier) => modifier.getText())
    .join(" ");
