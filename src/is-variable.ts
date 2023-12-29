import { Node, type VariableDeclaration } from "ts-morph";
import { isFunctionExpression } from "./is-function-expression";

export const isVariable = (node: Node): node is VariableDeclaration =>
  Node.isVariableDeclaration(node) && !isFunctionExpression(node);
