import * as tsm from "ts-morph";

export function getDeclarationName({
  exportName,
  declaration,
}: {
  exportName: string;
  declaration: tsm.ExportedDeclarations;
}): string {
  if (
    exportName !== "default" ||
    tsm.Node.isExpression(declaration) ||
    tsm.Node.isSourceFile(declaration)
  ) {
    return exportName;
  }

  return declaration.getName() ?? exportName;
}
