import {
    ClassConstructorDeclaration,
    ClassDeclaration,
    ClassMethodDeclaration,
    ClassPropertyDeclaration,
    Declaration,
    EnumDeclaration,
    EnumMemberDeclaration,
    FunctionDeclaration,
    InterfaceCallSignatureDeclaration,
    InterfaceConstructSignatureDeclaration,
    InterfaceDeclaration,
    InterfaceIndexSignatureDeclaration,
    InterfaceMethodDeclaration,
    InterfacePropertyDeclaration,
    NamespaceDeclaration,
    TypeAliasDeclaration,
    VariableDeclaration,
} from './module-declarations';

export function isVariableDeclaration(
    declaration: Declaration
): declaration is VariableDeclaration {
    return declaration.kind === 'variable';
}

export function isFunctionDeclaration(
    declaration: Declaration
): declaration is FunctionDeclaration {
    return declaration.kind === 'function';
}

export function isClassDeclaration(
    declaration: Declaration
): declaration is ClassDeclaration {
    return declaration.kind === 'class';
}

export function isClassConstructorDeclaration(
    declaration: Declaration
): declaration is ClassConstructorDeclaration {
    return declaration.kind === 'classConstructor';
}

export function isClassPropertyDeclaration(
    declaration: Declaration
): declaration is ClassPropertyDeclaration {
    return declaration.kind === 'classProperty';
}

export function isClassMethodDeclaration(
    declaration: Declaration
): declaration is ClassMethodDeclaration {
    return declaration.kind === 'classMethod';
}

export function isInterfaceDeclaration(
    declaration: Declaration
): declaration is InterfaceDeclaration {
    return declaration.kind === 'interface';
}

export function isInterfacePropertyDeclaration(
    declaration: Declaration
): declaration is InterfacePropertyDeclaration {
    return declaration.kind === 'interfaceProperty';
}

export function isInterfaceMethodDeclaration(
    declaration: Declaration
): declaration is InterfaceMethodDeclaration {
    return declaration.kind === 'interfaceMethod';
}

export function isInterfaceConstructSignatureDeclaration(
    declaration: Declaration
): declaration is InterfaceConstructSignatureDeclaration {
    return declaration.kind === 'interfaceConstructSignature';
}

export function isInterfaceCallSignatureDeclaration(
    declaration: Declaration
): declaration is InterfaceCallSignatureDeclaration {
    return declaration.kind === 'interfaceCallSignature';
}

export function isInterfaceIndexSignatureDeclaration(
    declaration: Declaration
): declaration is InterfaceIndexSignatureDeclaration {
    return declaration.kind === 'interfaceIndexSignature';
}

export function isEnumDeclaration(
    declaration: Declaration
): declaration is EnumDeclaration {
    return declaration.kind === 'enum';
}

export function isEnumMemberDeclaration(
    declaration: Declaration
): declaration is EnumMemberDeclaration {
    return declaration.kind === 'enumMember';
}

export function isTypeAliasDeclaration(
    declaration: Declaration
): declaration is TypeAliasDeclaration {
    return declaration.kind === 'typeAlias';
}

export function isNamespaceDeclaration(
    declaration: Declaration
): declaration is NamespaceDeclaration {
    return declaration.kind === 'namespace';
}
