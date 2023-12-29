import { Node, type BinaryExpression } from "ts-morph";

export const isVariableAssignmentExpression: (
  node: Node,
) => node is BinaryExpression = (node: Node): node is BinaryExpression =>
  Node.isBinaryExpression(node) && Node.isIdentifier(node.getLeft());
