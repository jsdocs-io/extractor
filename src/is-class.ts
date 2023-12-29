import { Node, type ClassDeclaration } from "ts-morph";

export const isClass = (node: Node): node is ClassDeclaration =>
  Node.isClassDeclaration(node);
