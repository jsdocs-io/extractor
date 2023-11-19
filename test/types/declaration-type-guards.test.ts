import { describe, expect, it } from 'vitest';
import {
    DeclarationKinds,
    isClassConstructorDeclaration,
    isClassDeclaration,
    isClassMethodDeclaration,
    isClassPropertyDeclaration,
    isEnumDeclaration,
    isEnumMemberDeclaration,
    isFunctionDeclaration,
    isInterfaceCallSignatureDeclaration,
    isInterfaceConstructSignatureDeclaration,
    isInterfaceDeclaration,
    isInterfaceIndexSignatureDeclaration,
    isInterfaceMethodDeclaration,
    isInterfacePropertyDeclaration,
    isNamespaceDeclaration,
    isTypeAliasDeclaration,
    isVariableDeclaration,
} from '../../src';

describe('isVariableDeclaration', () => {
    it('guards VariableDeclaration instances', () => {
        expect(
            isVariableDeclaration({
                kind: DeclarationKinds.VariableDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isVariableDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isFunctionDeclaration', () => {
    it('guards FunctionDeclaration instances', () => {
        expect(
            isFunctionDeclaration({
                kind: DeclarationKinds.FunctionDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isFunctionDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isClassDeclaration', () => {
    it('guards ClassDeclaration instances', () => {
        expect(
            isClassDeclaration({
                kind: DeclarationKinds.ClassDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isClassDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isClassConstructorDeclaration', () => {
    it('guards ClassConstructorDeclaration instances', () => {
        expect(
            isClassConstructorDeclaration({
                kind: DeclarationKinds.ClassConstructorDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isClassConstructorDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isClassPropertyDeclaration', () => {
    it('guards ClassPropertyDeclaration instances', () => {
        expect(
            isClassPropertyDeclaration({
                kind: DeclarationKinds.ClassPropertyDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isClassPropertyDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isClassMethodDeclaration', () => {
    it('guards ClassMethodDeclaration instances', () => {
        expect(
            isClassMethodDeclaration({
                kind: DeclarationKinds.ClassMethodDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isClassMethodDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceDeclaration', () => {
    it('guards InterfaceDeclaration instances', () => {
        expect(
            isInterfaceDeclaration({
                kind: DeclarationKinds.InterfaceDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isInterfaceDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isInterfacePropertyDeclaration', () => {
    it('guards InterfacePropertyDeclaration instances', () => {
        expect(
            isInterfacePropertyDeclaration({
                kind: DeclarationKinds.InterfacePropertyDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isInterfacePropertyDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceMethodDeclaration', () => {
    it('guards InterfaceMethodDeclaration instances', () => {
        expect(
            isInterfaceMethodDeclaration({
                kind: DeclarationKinds.InterfaceMethodDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isInterfaceMethodDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceConstructSignatureDeclaration', () => {
    it('guards InterfaceConstructSignatureDeclaration instances', () => {
        expect(
            isInterfaceConstructSignatureDeclaration({
                kind: DeclarationKinds.InterfaceConstructSignatureDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isVariableDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceCallSignatureDeclaration', () => {
    it('guards InterfaceCallSignatureDeclaration instances', () => {
        expect(
            isInterfaceCallSignatureDeclaration({
                kind: DeclarationKinds.InterfaceCallSignatureDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isInterfaceCallSignatureDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceIndexSignatureDeclaration', () => {
    it('guards InterfaceIndexSignatureDeclaration instances', () => {
        expect(
            isInterfaceIndexSignatureDeclaration({
                kind: DeclarationKinds.InterfaceIndexSignatureDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isInterfaceIndexSignatureDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isEnumDeclaration', () => {
    it('guards EnumDeclaration instances', () => {
        expect(
            isEnumDeclaration({
                kind: DeclarationKinds.EnumDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isEnumDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isEnumMemberDeclaration', () => {
    it('guards EnumMemberDeclaration instances', () => {
        expect(
            isEnumMemberDeclaration({
                kind: DeclarationKinds.EnumMemberDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isEnumMemberDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isTypeAliasDeclaration', () => {
    it('guards TypeAliasDeclaration instances', () => {
        expect(
            isTypeAliasDeclaration({
                kind: DeclarationKinds.TypeAliasDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isTypeAliasDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(false);
    });
});

describe('isNamespaceDeclaration', () => {
    it('guards NamespaceDeclaration instances', () => {
        expect(
            isNamespaceDeclaration({
                kind: DeclarationKinds.NamespaceDeclaration,
            } as any)
        ).toBe(true);

        expect(
            isNamespaceDeclaration({
                kind: DeclarationKinds.VariableDeclaration,
            } as any)
        ).toBe(false);
    });
});
