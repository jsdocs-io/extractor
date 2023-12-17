import { SourceFile, SyntaxKind } from "ts-morph";

export const packageOverview = (indexFile: SourceFile): string | undefined => {
  return indexFile
    .getDescendantsOfKind(SyntaxKind.JSDocTag)
    .find((tag) => tag.getTagName() === "packageDocumentation")
    ?.getParentIfKind(SyntaxKind.JSDoc)
    ?.getText();
};
