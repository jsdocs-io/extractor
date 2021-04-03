import * as tsm from 'ts-morph';
import {
    DeclarationKinds,
    TypeAliasDeclaration,
} from '../types/module-declarations';
import { formatText } from './format';
import { getJSDocs } from './get-jsdocs';
import { SourceProvider } from './source-provider';

export function isTypeAlias(
    declaration: tsm.Node
): declaration is tsm.TypeAliasDeclaration {
    return tsm.Node.isTypeAliasDeclaration(declaration);
}

export function newTypeAlias({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.TypeAliasDeclaration;
    getSource: SourceProvider;
}): TypeAliasDeclaration {
    const kind = DeclarationKinds.TypeAliasDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const signature = getTypeAliasSignature({ declaration });

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
    };
}

function getTypeAliasSignature({
    declaration,
}: {
    declaration: tsm.TypeAliasDeclaration;
}): string {
    const signature = declaration.getText();
    return formatText(signature);
}
