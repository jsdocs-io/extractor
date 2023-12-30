import { ModuleDeclaration, Node, type Project } from "ts-morph";
import { isHidden } from "./is-hidden";

export type AmbientModulesDeclarationsReturn = {
  containerName: string;
  exportName: string;
  declaration: ModuleDeclaration;
}[];

export const ambientModulesDeclarations = (
  project: Project,
  containerName: string,
): AmbientModulesDeclarationsReturn => {
  const ambientModulesDeclarations = [];
  for (const symbol of project.getAmbientModules()) {
    for (const declaration of symbol.getDeclarations()) {
      if (isHidden(declaration) || !Node.isModuleDeclaration(declaration)) {
        continue;
      }
      // TODO: add only from analyzed package
      const filepath = declaration.getSourceFile().getFilePath();
      if (filepath.startsWith("/node_modules")) {
        continue;
      }
      const exportName = declaration.getName();
      // TODO:
      // Remove surrounding quotes and eventual spaces
      // const exportID = exportName
      //   .replace(/"|'/g, "")
      //   .replace(/\s/g, "_")
      //   .trim();
      ambientModulesDeclarations.push({
        containerName,
        exportName,
        declaration,
      });
    }
  }
  return ambientModulesDeclarations;
};
