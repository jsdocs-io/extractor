import type { ModuleDeclaration, SourceFile } from "ts-morph";
import { isHidden } from "./is-hidden";

export const exportedDeclarations = (
  container: SourceFile | ModuleDeclaration,
  containerName: string,
) => {
  const exportedDeclarations = [];
  for (const [
    exportName,
    declarations,
  ] of container.getExportedDeclarations()) {
    for (const declaration of declarations) {
      if (isHidden(declaration)) {
        continue;
      }
      exportedDeclarations.push({ containerName, exportName, declaration });
    }
  }
  return exportedDeclarations;
};
