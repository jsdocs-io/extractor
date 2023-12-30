import { ModuleDeclaration, Node, SourceFile } from "ts-morph";
import { isGlobal } from "./is-global";
import { isHidden } from "./is-hidden";

export const globalAmbientDeclarations = (
  container: SourceFile | ModuleDeclaration,
  containerName: string,
) => {
  if (!Node.isSourceFile(container)) {
    return [];
  }

  // See https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#global-variables
  const globalCandidates = [
    ...container.getVariableDeclarations(),
    ...container.getFunctions(),
    ...container.getModules(),
  ];

  const globalAmbientDeclarations = [];
  for (const declaration of globalCandidates) {
    // Global ambient functions must have a name
    const exportName = declaration.getName()!;
    if (isHidden(declaration) || !isGlobal(declaration)) {
      continue;
    }
    globalAmbientDeclarations.push({ containerName, exportName, declaration });
  }
  return globalAmbientDeclarations;
};
