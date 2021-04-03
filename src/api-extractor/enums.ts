import * as tsm from 'ts-morph';
import {
    Declaration,
    DeclarationKinds,
    EnumDeclaration,
    EnumMemberDeclaration,
} from '../types/module-declarations';
import { formatEnumMember, formatText } from './format';
import { getJSDocs } from './get-jsdocs';
import { isInternalDeclaration } from './is-internal-declaration';
import { sortByID } from './sort-by-id';
import { SourceProvider } from './source-provider';
import { toID } from './to-id';

export function isEnum(
    declaration: tsm.Node
): declaration is tsm.EnumDeclaration {
    return tsm.Node.isEnumDeclaration(declaration);
}

export function newEnum({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.EnumDeclaration;
    getSource: SourceProvider;
}): EnumDeclaration {
    const kind = DeclarationKinds.EnumDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const isConst = declaration.isConstEnum();

    // Keep members in original order for signature text and sort them later
    const members = getEnumMembers({
        enumID: id,
        enumDeclaration: declaration,
        getSource,
    });
    const signature = getEnumSignature({ isConst, name, members });
    members.sort(sortByID);

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
        isConst,
        members,
    };
}

function getEnumMembers({
    enumID,
    enumDeclaration,
    getSource,
}: {
    enumID: string;
    enumDeclaration: tsm.EnumDeclaration;
    getSource: SourceProvider;
}): EnumMemberDeclaration[] {
    return enumDeclaration.getMembers().flatMap((declaration) => {
        const name = declaration.getName();
        if (isInternalDeclaration({ declaration, name })) {
            return [];
        }

        const kind = DeclarationKinds.EnumMemberDeclaration;
        const id = toID(enumID, name);
        const docs = getJSDocs({ declaration });
        const source = getSource({ declaration });
        const signature = formatEnumMember(declaration.getText());
        const value = declaration.getValue();

        return {
            kind,
            id,
            name,
            docs,
            source,
            signature,
            value,
        };
    });
}

function getEnumSignature({
    isConst,
    name,
    members,
}: {
    isConst: boolean;
    name: string;
    members: Declaration[];
}): string {
    const kind = isConst ? 'const enum' : 'enum';
    const membersText = members.map(({ signature }) => signature).join();
    const signature = `${kind} ${name} { ${membersText} }`;
    return formatText(signature);
}
