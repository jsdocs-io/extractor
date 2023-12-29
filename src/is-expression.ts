import { Node, type Expression } from "ts-morph";

export const isExpression: (node: Node) => node is Expression = (
  node: Node,
): node is Expression => Node.isExpression(node);
