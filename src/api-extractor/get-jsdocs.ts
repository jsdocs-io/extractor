import * as tsdoc from '@microsoft/tsdoc';
import * as tsm from 'ts-morph';

export function getJSDocs({
    declaration,
}: {
    declaration: tsm.Node;
}): string[] {
    const declarations = getDeclarationsWithDocs({ declaration });
    const allDocs = declarations.flatMap((declaration) => {
        const doc = getLastJSDoc({ declaration });
        return doc ? doc : [];
    });

    return Array.from(new Set(allDocs));
}

function getDeclarationsWithDocs({
    declaration,
}: {
    declaration: tsm.Node;
}): tsm.Node[] {
    if (tsm.Node.isVariableDeclaration(declaration)) {
        return [declaration.getVariableStatementOrThrow()];
    }

    if (tsm.Node.isExpression(declaration)) {
        return [declaration.getParent()!];
    }

    // Make functions and class methods share the same docs,
    // that is one declaration with multiple (overload) docs,
    // since they have their signature built from the typechecker.
    // Exclude constructors since their signatures are built manually and
    // thus each constructor needs its own doc.
    if (
        tsm.Node.isOverloadable(declaration) &&
        !tsm.Node.isConstructorDeclaration(declaration)
    ) {
        const overloads = declaration.getOverloads();
        const implementation = declaration.getImplementation();

        return [...overloads, ...(implementation ? [implementation] : [])];
    }

    // Make interface methods share the same docs as for overloadable nodes
    if (
        tsm.Node.isMethodSignature(declaration) &&
        declaration.getParent().getKind() ===
            tsm.SyntaxKind.InterfaceDeclaration
    ) {
        const methodName = declaration.getName();
        const overloads = declaration
            .getParentIfKindOrThrow(tsm.SyntaxKind.InterfaceDeclaration)
            .getMethods()
            .filter((method) => method.getName() === methodName);

        return overloads;
    }

    return [declaration];
}

function getLastJSDoc({
    declaration,
}: {
    declaration: tsm.Node;
}): string | undefined {
    // Get the doc closest to the declaration signature
    const doc = declaration.getLastChildByKind(tsm.SyntaxKind.JSDoc)?.getText();
    if (!doc) {
        return undefined;
    }

    // The first declaration after package documentation
    // should not inherit that jsdoc if it has none.
    // See `export-named-declaration-without-jsdoc.test.ts`.
    const isPackageDocumentation = new tsdoc.TSDocParser()
        .parseString(doc)
        .docComment.modifierTagSet.isPackageDocumentation();
    if (isPackageDocumentation) {
        return undefined;
    }

    return doc;
}
