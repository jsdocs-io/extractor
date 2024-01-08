import {
  SyntaxKind,
  type ClassDeclaration,
  type InterfaceDeclaration,
} from "ts-morph";

export const headText = (
  declaration: ClassDeclaration | InterfaceDeclaration,
): string => {
  const parts = [];
  for (const node of declaration.getChildren()) {
    if (node.getKind() === SyntaxKind.JSDoc) {
      // Ignore JSDoc comments.
      continue;
    }
    if (node.getKind() === SyntaxKind.OpenBraceToken) {
      // Stop at body start, marked by the first `{`
      // found in a class or interface declaration.
      break;
    }
    parts.push(node.getText());
  }
  parts.push("{}");
  return parts.join(" ");
};
