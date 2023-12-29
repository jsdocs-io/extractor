import { Node, type TypeAliasDeclaration } from "ts-morph";

export const isTypeAlias = (node: Node): node is TypeAliasDeclaration =>
  Node.isTypeAliasDeclaration(node);
