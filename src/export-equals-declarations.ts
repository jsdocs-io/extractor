import { SyntaxKind } from "ts-morph";
import type { DeclarationsContainer } from "./declarations-container";
import { isExportedDeclarations } from "./is-exported-declarations";
import { isHidden } from "./is-hidden";
import { isNamespace } from "./is-namespace";
import { isShorthandAmbientModule } from "./is-shorthand-ambient-module";

export const exportEqualsDeclarations = (
  container: DeclarationsContainer,
  containerName: string,
) => {
  if (isShorthandAmbientModule(container)) {
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
      !isExportedDeclarations(declaration)
    ) {
      // Skip internal, private or unsupported declarations.
      return [];
    }
    if (isNamespace(declaration)) {
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
