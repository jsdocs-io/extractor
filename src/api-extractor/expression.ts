import * as tsm from 'ts-morph';
import {
    DeclarationKinds,
    VariableDeclaration,
} from '../types/module-declarations';
import { getApparentType } from './get-apparent-type';
import { getJSDocs } from './get-jsdocs';
import { SourceProvider } from './source-provider';
import { getVariableSignature, newVariable } from './variables';

export function isVariableAssignmentExpression(
    declaration: tsm.Node
): declaration is tsm.BinaryExpression {
    return (
        tsm.Node.isBinaryExpression(declaration) &&
        tsm.Node.isIdentifier(declaration.getLeft())
    );
}

export function newVariableAssignmentExpression({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.BinaryExpression;
    getSource: SourceProvider;
}): VariableDeclaration {
    const variableDeclaration = getVariableDeclaration({ declaration });
    const suggestedType = getApparentType({
        declaration: declaration.getRight(),
    });

    return newVariable({
        id,
        name,
        declaration: variableDeclaration,
        getSource,
        suggestedType,
    });
}

function getVariableDeclaration({
    declaration,
}: {
    declaration: tsm.BinaryExpression;
}): tsm.VariableDeclaration {
    return declaration
        .getLeft()
        .getSymbol()!
        .getDeclarations()[0] as tsm.VariableDeclaration;
}

export function isExpression(
    declaration: tsm.Node
): declaration is tsm.Expression {
    return tsm.Node.isExpression(declaration);
}

export function newExpression({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.Expression;
    getSource: SourceProvider;
}): VariableDeclaration {
    const kind = DeclarationKinds.VariableDeclaration;
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const variableKind = 'const';
    const type = getApparentType({ declaration });
    const signature = getVariableSignature({ variableKind, name, type });

    return {
        kind,
        id,
        name,
        docs,
        source,
        signature,
        variableKind,
        type,
    };
}
