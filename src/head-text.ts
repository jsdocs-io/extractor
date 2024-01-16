import {
  EnumDeclaration,
  ModuleDeclaration,
  SyntaxKind,
  type ClassDeclaration,
  type InterfaceDeclaration,
} from "ts-morph";

export const headText = (
  declaration:
    | ClassDeclaration
    | InterfaceDeclaration
    | EnumDeclaration
    | ModuleDeclaration,
): string => {
  const parts = [];
  for (const node of declaration.getChildren()) {
    if (node.getKind() === SyntaxKind.JSDoc) {
      // Ignore JSDoc comments.
      continue;
    }
    if (node.getKind() === SyntaxKind.OpenBraceToken) {
      // Stop at body start, marked by the first `{`
      // found in a class, interface or enum declaration.
      break;
    }
    if (node.getKind() === SyntaxKind.ModuleBlock) {
      // Stop at module body start, found in a namespace declaration.
      break;
    }
    parts.push(node.getText());
  }
  parts.push("{}");
  return parts.join(" ");
};
