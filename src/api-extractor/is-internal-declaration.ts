import * as tsdoc from '@microsoft/tsdoc';
import * as tsm from 'ts-morph';
import { getJSDocs } from './get-jsdocs';

export function isInternalDeclaration({
    declaration,
    name = '',
}: {
    declaration: tsm.Node;
    name?: string;
}): boolean {
    return (
        name.startsWith('_') ||
        name.startsWith('#') ||
        hasPrivateModifier({ declaration }) ||
        hasInternalTagDoc({ declaration })
    );
}

function hasPrivateModifier({
    declaration,
}: {
    declaration: tsm.Node;
}): boolean {
    return (
        tsm.Node.isModifierable(declaration) &&
        declaration.hasModifier(tsm.SyntaxKind.PrivateKeyword)
    );
}

function hasInternalTagDoc({
    declaration,
}: {
    declaration: tsm.Node;
}): boolean {
    const firstDoc = getJSDocs({ declaration })[0];
    if (!firstDoc) {
        return false;
    }

    const parser = new tsdoc.TSDocParser();
    return parser.parseString(firstDoc).docComment.modifierTagSet.isInternal();
}
