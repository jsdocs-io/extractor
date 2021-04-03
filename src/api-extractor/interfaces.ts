import * as tsm from 'ts-morph';
import {
    isInterfaceCallSignatureDeclaration,
    isInterfaceConstructSignatureDeclaration,
    isInterfaceIndexSignatureDeclaration,
    isInterfaceMethodDeclaration,
    isInterfacePropertyDeclaration,
} from '../types/declaration-type-guards';
import {
    DeclarationKinds,
    InterfaceCallSignatureDeclaration,
    InterfaceConstructSignatureDeclaration,
    InterfaceDeclaration,
    InterfaceIndexSignatureDeclaration,
    InterfaceMemberDeclarations,
    InterfaceMethodDeclaration,
    InterfacePropertyDeclaration,
} from '../types/module-declarations';
import { formatInterfaceMember } from './format';
import { getApparentType } from './get-apparent-type';
import { getJSDocs } from './get-jsdocs';
import { getWrapperSignature } from './get-wrapper-signature';
import { isInternalDeclaration } from './is-internal-declaration';
import { sortByID } from './sort-by-id';
import { SourceProvider } from './source-provider';
import { toID } from './to-id';
import { TypeChecker } from './type-checker';

export function isInterface(
    declaration: tsm.Node
): declaration is tsm.InterfaceDeclaration {
    return tsm.Node.isInterfaceDeclaration(declaration);
}

export function newInterface({
    id,
    name,
    declaration,
    getSource,
    getType,
}: {
    id: string;
    name: string;
    declaration: tsm.InterfaceDeclaration;
    getSource: SourceProvider;
    getType: TypeChecker;
}): InterfaceDeclaration {
    const kind = DeclarationKinds.InterfaceDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const signature = getWrapperSignature({ declaration });

    const members = getInterfaceMembers({
        interfaceID: id,
        interfaceDeclaration: declaration,
        getSource,
        getType,
    });

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
        members,
    };
}

function getInterfaceMembers({
    interfaceID,
    interfaceDeclaration,
    getSource,
    getType,
}: {
    interfaceID: string;
    interfaceDeclaration: tsm.InterfaceDeclaration;
    getSource: SourceProvider;
    getType: TypeChecker;
}): InterfaceMemberDeclarations {
    const seenMethods = new Set<string>();
    const members = interfaceDeclaration
        .getMembers()
        .flatMap((declaration, index) => {
            const name = getMemberName({ declaration });
            const id = toID(interfaceID, getMemberID({ declaration, index }));

            if (isInternalDeclaration({ declaration, name })) {
                return [];
            }

            if (tsm.Node.isPropertySignature(declaration)) {
                return newProperty({ id, name, declaration, getSource });
            }

            if (tsm.Node.isMethodSignature(declaration)) {
                // Skip overloaded methods
                if (seenMethods.has(id)) {
                    return [];
                }

                seenMethods.add(id);
                return newMethod({ id, name, declaration, getSource, getType });
            }

            if (tsm.Node.isConstructSignatureDeclaration(declaration)) {
                return newConstructSignature({
                    id,
                    name,
                    declaration,
                    getSource,
                });
            }

            if (tsm.Node.isCallSignatureDeclaration(declaration)) {
                return newCallSignature({ id, name, declaration, getSource });
            }

            return newIndexSignature({ id, name, declaration, getSource });
        })
        .sort(sortByID);

    return {
        properties: members.filter(isInterfacePropertyDeclaration),
        methods: members.filter(isInterfaceMethodDeclaration),
        constructSignatures: members.filter(
            isInterfaceConstructSignatureDeclaration
        ),
        callSignatures: members.filter(isInterfaceCallSignatureDeclaration),
        indexSignatures: members.filter(isInterfaceIndexSignatureDeclaration),
    };
}

function getMemberName({
    declaration,
}: {
    declaration: tsm.TypeElementTypes;
}): string {
    if (
        tsm.Node.isPropertySignature(declaration) ||
        tsm.Node.isMethodSignature(declaration)
    ) {
        return declaration.getName();
    }

    if (tsm.Node.isConstructSignatureDeclaration(declaration)) {
        return 'construct signature';
    }

    if (tsm.Node.isCallSignatureDeclaration(declaration)) {
        return 'call signature';
    }

    return 'index signature';
}

function getMemberID({
    declaration,
    index,
}: {
    declaration: tsm.TypeElementTypes;
    index: number;
}): string {
    if (
        tsm.Node.isPropertySignature(declaration) ||
        tsm.Node.isMethodSignature(declaration)
    ) {
        return declaration.getName();
    }

    if (tsm.Node.isConstructSignatureDeclaration(declaration)) {
        return `${index}-construct-signature`;
    }

    if (tsm.Node.isCallSignatureDeclaration(declaration)) {
        return `${index}-call-signature`;
    }

    return `${index}-index-signature`;
}

function newProperty({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.PropertySignature;
    getSource: SourceProvider;
}): InterfacePropertyDeclaration {
    const kind = DeclarationKinds.InterfacePropertyDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const isReadonly = declaration.isReadonly();
    const isOptional = declaration.hasQuestionToken();
    const type = getApparentType({ declaration });
    const signature = formatInterfaceMember(declaration.getText());

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
        isReadonly,
        isOptional,
        type,
    };
}

function newMethod({
    id,
    name,
    declaration,
    getSource,
    getType,
}: {
    id: string;
    name: string;
    declaration: tsm.MethodSignature;
    getSource: SourceProvider;
    getType: TypeChecker;
}): InterfaceMethodDeclaration {
    const kind = DeclarationKinds.InterfaceMethodDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const type = getType({ declaration });
    const signature = formatInterfaceMember(`${name}: ${type}`);

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
        type,
    };
}

function newConstructSignature({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.ConstructSignatureDeclaration;
    getSource: SourceProvider;
}): InterfaceConstructSignatureDeclaration {
    const kind = DeclarationKinds.InterfaceConstructSignatureDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const signature = formatInterfaceMember(declaration.getText());

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
    };
}

function newCallSignature({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.CallSignatureDeclaration;
    getSource: SourceProvider;
}): InterfaceCallSignatureDeclaration {
    const kind = DeclarationKinds.InterfaceCallSignatureDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const signature = formatInterfaceMember(declaration.getText());

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
    };
}

function newIndexSignature({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.IndexSignatureDeclaration;
    getSource: SourceProvider;
}): InterfaceIndexSignatureDeclaration {
    const kind = DeclarationKinds.InterfaceIndexSignatureDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const signature = formatInterfaceMember(declaration.getText());

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
    };
}
