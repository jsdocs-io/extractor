import { describe, expect, it } from 'vitest';
import {
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
                kind: 'variable',
            } as any)
        ).toBe(true);

        expect(
            isVariableDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isFunctionDeclaration', () => {
    it('guards FunctionDeclaration instances', () => {
        expect(
            isFunctionDeclaration({
                kind: 'function',
            } as any)
        ).toBe(true);

        expect(
            isFunctionDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isClassDeclaration', () => {
    it('guards ClassDeclaration instances', () => {
        expect(
            isClassDeclaration({
                kind: 'class',
            } as any)
        ).toBe(true);

        expect(
            isClassDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isClassConstructorDeclaration', () => {
    it('guards ClassConstructorDeclaration instances', () => {
        expect(
            isClassConstructorDeclaration({
                kind: 'classConstructor',
            } as any)
        ).toBe(true);

        expect(
            isClassConstructorDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isClassPropertyDeclaration', () => {
    it('guards ClassPropertyDeclaration instances', () => {
        expect(
            isClassPropertyDeclaration({
                kind: 'classProperty',
            } as any)
        ).toBe(true);

        expect(
            isClassPropertyDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isClassMethodDeclaration', () => {
    it('guards ClassMethodDeclaration instances', () => {
        expect(
            isClassMethodDeclaration({
                kind: 'classMethod',
            } as any)
        ).toBe(true);

        expect(
            isClassMethodDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceDeclaration', () => {
    it('guards InterfaceDeclaration instances', () => {
        expect(
            isInterfaceDeclaration({
                kind: 'interface',
            } as any)
        ).toBe(true);

        expect(
            isInterfaceDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isInterfacePropertyDeclaration', () => {
    it('guards InterfacePropertyDeclaration instances', () => {
        expect(
            isInterfacePropertyDeclaration({
                kind: 'interfaceProperty',
            } as any)
        ).toBe(true);

        expect(
            isInterfacePropertyDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceMethodDeclaration', () => {
    it('guards InterfaceMethodDeclaration instances', () => {
        expect(
            isInterfaceMethodDeclaration({
                kind: 'interfaceMethod',
            } as any)
        ).toBe(true);

        expect(
            isInterfaceMethodDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceConstructSignatureDeclaration', () => {
    it('guards InterfaceConstructSignatureDeclaration instances', () => {
        expect(
            isInterfaceConstructSignatureDeclaration({
                kind: 'interfaceConstructSignature',
            } as any)
        ).toBe(true);

        expect(
            isVariableDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceCallSignatureDeclaration', () => {
    it('guards InterfaceCallSignatureDeclaration instances', () => {
        expect(
            isInterfaceCallSignatureDeclaration({
                kind: 'interfaceCallSignature',
            } as any)
        ).toBe(true);

        expect(
            isInterfaceCallSignatureDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isInterfaceIndexSignatureDeclaration', () => {
    it('guards InterfaceIndexSignatureDeclaration instances', () => {
        expect(
            isInterfaceIndexSignatureDeclaration({
                kind: 'interfaceIndexSignature',
            } as any)
        ).toBe(true);

        expect(
            isInterfaceIndexSignatureDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isEnumDeclaration', () => {
    it('guards EnumDeclaration instances', () => {
        expect(
            isEnumDeclaration({
                kind: 'enum',
            } as any)
        ).toBe(true);

        expect(
            isEnumDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isEnumMemberDeclaration', () => {
    it('guards EnumMemberDeclaration instances', () => {
        expect(
            isEnumMemberDeclaration({
                kind: 'enumMember',
            } as any)
        ).toBe(true);

        expect(
            isEnumMemberDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isTypeAliasDeclaration', () => {
    it('guards TypeAliasDeclaration instances', () => {
        expect(
            isTypeAliasDeclaration({
                kind: 'typeAlias',
            } as any)
        ).toBe(true);

        expect(
            isTypeAliasDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(false);
    });
});

describe('isNamespaceDeclaration', () => {
    it('guards NamespaceDeclaration instances', () => {
        expect(
            isNamespaceDeclaration({
                kind: 'namespace',
            } as any)
        ).toBe(true);

        expect(
            isNamespaceDeclaration({
                kind: 'variable',
            } as any)
        ).toBe(false);
    });
});
