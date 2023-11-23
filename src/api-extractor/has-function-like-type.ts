import * as tsm from "ts-morph";

export function hasFunctionLikeType(node: tsm.VariableDeclaration): boolean {
  const typeKind = node.getTypeNode()?.getKind();
  const hasFunctionType = typeKind === tsm.SyntaxKind.FunctionType;
  if (hasFunctionType) {
    return true;
  }

  const initializer = node.getInitializer();
  if (!initializer) {
    return false;
  }

  const hasFunctionInitializer =
    tsm.Node.isArrowFunction(initializer) ||
    tsm.Node.isFunctionExpression(initializer);

  return hasFunctionInitializer;
}
