import * as tsm from "ts-morph";

export function isExportedDeclarations(
  declaration: tsm.Node,
): declaration is tsm.ExportedDeclarations {
  return (
    tsm.Node.isVariableDeclaration(declaration) ||
    tsm.Node.isClassDeclaration(declaration) ||
    tsm.Node.isInterfaceDeclaration(declaration) ||
    tsm.Node.isEnumDeclaration(declaration) ||
    tsm.Node.isTypeAliasDeclaration(declaration) ||
    tsm.Node.isModuleDeclaration(declaration) ||
    tsm.Node.isExpression(declaration) ||
    tsm.Node.isFunctionDeclaration(declaration)
  );
}
