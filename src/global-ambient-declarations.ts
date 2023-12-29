import { Node } from "ts-morph";
import type { DeclarationsContainer } from "./container-declarations";
import { isGlobalDeclaration } from "./is-global-declaration";
import { isHidden } from "./is-hidden";

export const globalAmbientDeclarations = (
  container: DeclarationsContainer,
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
    if (
      !isGlobalDeclaration(declaration) ||
      isHidden(declaration, exportName)
    ) {
      continue;
    }
    globalAmbientDeclarations.push({ containerName, exportName, declaration });
  }
  return globalAmbientDeclarations;
};
