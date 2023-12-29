import { Node, SyntaxKind, type VariableDeclaration } from "ts-morph";

export const isFunctionExpression = (node: Node): node is VariableDeclaration =>
  Node.isVariableDeclaration(node) && hasFunctionLikeType(node);

const hasFunctionLikeType = (declaration: VariableDeclaration): boolean => {
  if (declaration.getTypeNode()?.getKind() === SyntaxKind.FunctionType) {
    return true;
  }
  const initializer = declaration.getInitializer();
  if (
    initializer &&
    (Node.isArrowFunction(initializer) ||
      Node.isFunctionExpression(initializer))
  ) {
    return true;
  }
  return false;
};
