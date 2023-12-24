import {
  FunctionDeclaration,
  ModuleDeclaration,
  Node,
  type VariableDeclaration,
} from "ts-morph";

export const isGlobalDeclaration = (
  declaration: VariableDeclaration | FunctionDeclaration | ModuleDeclaration,
): boolean => {
  const isGlobalVariable =
    Node.isVariableDeclaration(declaration) &&
    declaration.getVariableStatementOrThrow().isAmbient() &&
    !declaration.isExported();
  const isGlobalFunction =
    Node.isFunctionDeclaration(declaration) &&
    declaration.isAmbient() &&
    declaration.getName() !== undefined &&
    !declaration.isExported();
  const isGlobalNamespace =
    Node.isModuleDeclaration(declaration) &&
    declaration.isAmbient() &&
    !declaration.isExported() &&
    !declaration.hasModuleKeyword();
  return isGlobalVariable || isGlobalFunction || isGlobalNamespace;
};
