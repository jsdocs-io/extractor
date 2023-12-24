import { Node, type ExportedDeclarations } from "ts-morph";

export const exportedDeclarationName = (
  exportName: string,
  declaration: ExportedDeclarations,
): string => {
  if (
    exportName !== "default" ||
    Node.isExpression(declaration) ||
    Node.isSourceFile(declaration)
  ) {
    return exportName;
  }
  return declaration.getName() ?? exportName;
};
