import type { DeclarationsContainer } from "./declarations-container";
import { isHidden } from "./is-hidden";

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
      if (isHidden(declaration, exportName)) {
        // Skip internal and private declarations.
        continue;
      }
      exportedDeclarations.push({ containerName, exportName, declaration });
    }
  }
  return exportedDeclarations;
};
