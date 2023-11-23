import * as tsm from "ts-morph";

export function getModifiersText({
  declaration,
}: {
  declaration: tsm.Node & tsm.ModifierableNode;
}): string {
  return declaration
    .getModifiers()
    .flatMap((modifier) => {
      // Ignore `public` modifier
      if (modifier.getKind() === tsm.SyntaxKind.PublicKeyword) {
        return [];
      }

      return modifier.getText();
    })
    .join(" ");
}
