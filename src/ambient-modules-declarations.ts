import { ModuleDeclaration, Node, type Project } from "ts-morph";
import { isHidden } from "./is-hidden";
import { sourceFilePath } from "./source-file-path";

export type AmbientModulesDeclarationsReturn = {
  containerName: string;
  exportName: string;
  declaration: ModuleDeclaration;
}[];

export const ambientModulesDeclarations = (
  containerName: string,
  project: Project,
  pkgName?: string,
): AmbientModulesDeclarationsReturn => {
  const ambientModulesDeclarations = [];
  for (const symbol of project.getAmbientModules()) {
    for (const declaration of symbol.getDeclarations()) {
      if (isHidden(declaration) || !Node.isModuleDeclaration(declaration)) {
        continue;
      }
      if (pkgName && !sourceFilePath(declaration).startsWith(`/${pkgName}`)) {
        // Ignore ambient modules that are not from the analyzed package.
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
