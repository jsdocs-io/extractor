import { Node, SyntaxKind } from "ts-morph";
import type { DeclarationsContainer } from "./container-declarations";
import { isHidden } from "./is-hidden";
import { nodeIsExportedDeclarations } from "./node-is-exported-declarations";

export const exportEqualsDeclarations = (
  container: DeclarationsContainer,
  containerName: string,
) => {
  if (Node.isModuleDeclaration(container) && !container.hasBody()) {
    // Skip shorthand ambient modules without body
    // (e.g., `declare module 'foo';`).
    return [];
  }
  const exportIdentifier = container
    .getExportAssignment((assignment) => assignment.isExportEquals())
    ?.getLastChildByKind(SyntaxKind.Identifier);
  if (!exportIdentifier) {
    return [];
  }
  const exportName = exportIdentifier.getText();
  const exportEqualsDeclarations = [];
  for (const declaration of exportIdentifier.getDefinitionNodes()) {
    if (
      isHidden(declaration, exportName) ||
      !nodeIsExportedDeclarations(declaration)
    ) {
      // Skip internal, private or unsupported declarations.
      return [];
    }
    if (Node.isModuleDeclaration(declaration)) {
      // Skip namespaces since `exportDeclarations` already extracts
      // the inner declarations of an export equals namespace as
      // non-namespaced declarations belonging to the parent container.
      // See snapshot for `export-equals-function-and-namespace.test.ts`.
      return [];
    }
    exportEqualsDeclarations.push({ containerName, exportName, declaration });
  }
  return exportEqualsDeclarations;
};
