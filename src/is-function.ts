import { Node, type FunctionDeclaration } from "ts-morph";

export const isFunction = (node: Node): node is FunctionDeclaration =>
  (Node.isFunctionDeclaration(node) &&
    (node.isAmbient() || node.isImplementation())) ||
  Node.isArrowFunction(node);
