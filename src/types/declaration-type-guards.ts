import {
    ClassConstructorDeclaration,
    ClassDeclaration,
    ClassMethodDeclaration,
    ClassPropertyDeclaration,
    Declaration,
    DeclarationKinds,
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
    return declaration.kind === DeclarationKinds.VariableDeclaration;
}

export function isFunctionDeclaration(
    declaration: Declaration
): declaration is FunctionDeclaration {
    return declaration.kind === DeclarationKinds.FunctionDeclaration;
}

export function isClassDeclaration(
    declaration: Declaration
): declaration is ClassDeclaration {
    return declaration.kind === DeclarationKinds.ClassDeclaration;
}

export function isClassConstructorDeclaration(
    declaration: Declaration
): declaration is ClassConstructorDeclaration {
    return declaration.kind === DeclarationKinds.ClassConstructorDeclaration;
}

export function isClassPropertyDeclaration(
    declaration: Declaration
): declaration is ClassPropertyDeclaration {
    return declaration.kind === DeclarationKinds.ClassPropertyDeclaration;
}

export function isClassMethodDeclaration(
    declaration: Declaration
): declaration is ClassMethodDeclaration {
    return declaration.kind === DeclarationKinds.ClassMethodDeclaration;
}

export function isInterfaceDeclaration(
    declaration: Declaration
): declaration is InterfaceDeclaration {
    return declaration.kind === DeclarationKinds.InterfaceDeclaration;
}

export function isInterfacePropertyDeclaration(
    declaration: Declaration
): declaration is InterfacePropertyDeclaration {
    return declaration.kind === DeclarationKinds.InterfacePropertyDeclaration;
}

export function isInterfaceMethodDeclaration(
    declaration: Declaration
): declaration is InterfaceMethodDeclaration {
    return declaration.kind === DeclarationKinds.InterfaceMethodDeclaration;
}

export function isInterfaceConstructSignatureDeclaration(
    declaration: Declaration
): declaration is InterfaceConstructSignatureDeclaration {
    return (
        declaration.kind ===
        DeclarationKinds.InterfaceConstructSignatureDeclaration
    );
}

export function isInterfaceCallSignatureDeclaration(
    declaration: Declaration
): declaration is InterfaceCallSignatureDeclaration {
    return (
        declaration.kind === DeclarationKinds.InterfaceCallSignatureDeclaration
    );
}

export function isInterfaceIndexSignatureDeclaration(
    declaration: Declaration
): declaration is InterfaceIndexSignatureDeclaration {
    return (
        declaration.kind === DeclarationKinds.InterfaceIndexSignatureDeclaration
    );
}

export function isEnumDeclaration(
    declaration: Declaration
): declaration is EnumDeclaration {
    return declaration.kind === DeclarationKinds.EnumDeclaration;
}

export function isEnumMemberDeclaration(
    declaration: Declaration
): declaration is EnumMemberDeclaration {
    return declaration.kind === DeclarationKinds.EnumMemberDeclaration;
}

export function isTypeAliasDeclaration(
    declaration: Declaration
): declaration is TypeAliasDeclaration {
    return declaration.kind === DeclarationKinds.TypeAliasDeclaration;
}

export function isNamespaceDeclaration(
    declaration: Declaration
): declaration is NamespaceDeclaration {
    return declaration.kind === DeclarationKinds.NamespaceDeclaration;
}
