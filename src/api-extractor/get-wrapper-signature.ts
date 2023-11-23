import * as tsm from "ts-morph";
import { formatText } from "./format";

export function getWrapperSignature({
  declaration,
}: {
  declaration: tsm.ClassDeclaration | tsm.InterfaceDeclaration;
}): string {
  const parts: string[] = [];

  for (const child of declaration.getChildren()) {
    // Ignore documentation comments
    if (isJSDocComment(child)) {
      continue;
    }

    // Stop at body start (e.g., the first opening bracket of a class).
    if (isOpenBraceToken(child)) {
      break;
    }

    parts.push(child.getText());
  }
  parts.push("{}");
  const signature = parts.join(" ");

  return formatText(signature);
}

function isJSDocComment(node: tsm.Node): boolean {
  return node.getKind() === tsm.SyntaxKind.JSDoc;
}

function isOpenBraceToken(node: tsm.Node): boolean {
  return node.getKind() === tsm.SyntaxKind.OpenBraceToken;
}
