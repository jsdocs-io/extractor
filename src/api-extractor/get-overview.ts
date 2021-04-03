import * as tsm from 'ts-morph';

export function getOverview({
    indexFile,
}: {
    indexFile: tsm.SourceFile;
}): string | undefined {
    return indexFile
        .getDescendantsOfKind(tsm.SyntaxKind.JSDocTag)
        .find((tag) => tag.getTagName() === 'packageDocumentation')
        ?.getParentIfKind(tsm.SyntaxKind.JSDocComment)
        ?.getText();
}
