import { Node, type ExportedDeclarations } from "ts-morph";

export const nodeIsExportedDeclarations = (
  node: Node,
): node is ExportedDeclarations =>
  Node.isVariableDeclaration(node) ||
  Node.isFunctionDeclaration(node) ||
  Node.isClassDeclaration(node) ||
  Node.isInterfaceDeclaration(node) ||
  Node.isEnumDeclaration(node) ||
  Node.isTypeAliasDeclaration(node) ||
  Node.isModuleDeclaration(node) ||
  Node.isExpression(node) ||
  Node.isSourceFile(node);
