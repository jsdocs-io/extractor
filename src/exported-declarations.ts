import type { DeclarationsContainer } from "./container-declarations";
import { isInternalNode } from "./is-internal-node";

export const exportedDeclarations = (
  container: DeclarationsContainer,
  containerName: string,
) => {
  const exportedDeclarations = [];
  for (const [
    exportName,
    declarations,
  ] of container.getExportedDeclarations()) {
    for (const declaration of declarations) {
      if (isInternalNode(declaration, exportName)) {
        // Skip internal and private declarations.
        continue;
      }
      exportedDeclarations.push({ containerName, exportName, declaration });
    }
  }
  return exportedDeclarations;
};
