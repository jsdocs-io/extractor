import { Node, type Project } from "ts-morph";

export const ambientModulesDeclarations = (project: Project) => {
  const ambientModulesDeclarations = [];
  for (const symbol of project.getAmbientModules()) {
    for (const declaration of symbol.getDeclarations()) {
      const filepath = declaration.getSourceFile().getFilePath();
      if (
        !Node.isModuleDeclaration(declaration) ||
        // TODO:
        filepath.startsWith("/node_modules")
      ) {
        continue;
      }
      const exportName = declaration.getName();

      // TODO:
      // Remove surrounding quotes and eventual spaces
      const exportID = exportName
        .replace(/"|'/g, "")
        .replace(/\s/g, "_")
        .trim();

      ambientModulesDeclarations.push({ exportName, declaration });
    }
  }
  return ambientModulesDeclarations;
};
