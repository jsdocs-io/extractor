import * as tsm from "ts-morph";

export function isGlobalDeclaration({
  declaration,
}: {
  declaration:
    | tsm.VariableDeclaration
    | tsm.FunctionDeclaration
    | tsm.ModuleDeclaration;
}): boolean {
  const isGlobalVariable =
    tsm.Node.isVariableDeclaration(declaration) &&
    declaration.getVariableStatementOrThrow().isAmbient() &&
    !declaration.isExported();

  const isGlobalFunction =
    tsm.Node.isFunctionDeclaration(declaration) &&
    declaration.isAmbient() &&
    declaration.getName() !== undefined &&
    !declaration.isExported();

  const isGlobalNamespace =
    tsm.Node.isModuleDeclaration(declaration) &&
    declaration.isAmbient() &&
    !declaration.isExported() &&
    !declaration.hasModuleKeyword();

  return isGlobalVariable || isGlobalFunction || isGlobalNamespace;
}
