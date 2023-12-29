import {
  Node,
  type FunctionDeclaration,
  type ModuleDeclaration,
  type VariableDeclaration,
} from "ts-morph";

export const isGlobal = (
  node: Node,
): node is VariableDeclaration | FunctionDeclaration | ModuleDeclaration => {
  const isGlobalVariable =
    Node.isVariableDeclaration(node) &&
    node.getVariableStatementOrThrow().isAmbient() &&
    !node.isExported();
  const isGlobalFunction =
    Node.isFunctionDeclaration(node) &&
    node.isAmbient() &&
    node.getName() !== undefined &&
    !node.isExported();
  const isGlobalNamespace =
    Node.isModuleDeclaration(node) &&
    node.isAmbient() &&
    !node.isExported() &&
    !node.hasModuleKeyword();
  return isGlobalVariable || isGlobalFunction || isGlobalNamespace;
};
