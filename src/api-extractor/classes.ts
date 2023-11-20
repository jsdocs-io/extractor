import * as tsm from 'ts-morph';
import {
    isClassMethodDeclaration,
    isClassPropertyDeclaration,
} from '../types/declaration-type-guards';
import {
    ClassConstructorDeclaration,
    ClassDeclaration,
    ClassMemberDeclarations,
    ClassMethodDeclaration,
    ClassPropertyDeclaration,
} from '../types/module-declarations';
import { formatClassMember } from './format';
import { getApparentType } from './get-apparent-type';
import { getJSDocs } from './get-jsdocs';
import { getModifiersText } from './get-modifiers-text';
import { getWrapperSignature } from './get-wrapper-signature';
import { isInternalDeclaration } from './is-internal-declaration';
import { sortByID } from './sort-by-id';
import { SourceProvider } from './source-provider';
import { toID } from './to-id';
import { TypeChecker } from './type-checker';

export function isClass(
    declaration: tsm.Node
): declaration is tsm.ClassDeclaration {
    return tsm.Node.isClassDeclaration(declaration);
}

export function newClass({
    id,
    name,
    declaration,
    getSource,
    getType,
}: {
    id: string;
    name: string;
    declaration: tsm.ClassDeclaration;
    getSource: SourceProvider;
    getType: TypeChecker;
}): ClassDeclaration {
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const isAbstract = declaration.isAbstract();
    const signature = getWrapperSignature({ declaration });

    const constructors = getClassConstructors({
        classID: id,
        classDeclaration: declaration,
        getSource,
    });

    const members = getClassMembers({
        classID: id,
        classDeclaration: declaration,
        getSource,
        getType,
    });

    return {
        kind: 'class',
        id,
        name,
        docs,
        source,
        signature,
        isAbstract,
        constructors,
        members,
    };
}

function getClassConstructors({
    classID,
    classDeclaration,
    getSource,
}: {
    classID: string;
    classDeclaration: tsm.ClassDeclaration;
    getSource: SourceProvider;
}): ClassConstructorDeclaration[] {
    // `getConstructors()` returns all constructors for ambient modules
    // but only the implementation constructor in normal modules
    const declaration = classDeclaration.getConstructors()[0];
    if (!declaration) {
        return [];
    }

    // Manually retrieve all constructors from the first constructor
    const overloads = declaration.getOverloads();
    const implementation = declaration.getImplementation();
    const constructors = [
        ...overloads,
        ...(implementation ? [implementation] : []),
    ];

    return constructors.flatMap((declaration, index) => {
        if (isInternalDeclaration({ declaration })) {
            return [];
        }

        const name = 'constructor';
        const id = toID(classID, `${index}-${name}`);
        const docs = getJSDocs({ declaration });
        const source = getSource({ declaration });
        const signature = getClassConstructorSignature({ declaration });

        return {
            kind: 'classConstructor',
            id,
            name,
            docs,
            source,
            signature,
        };
    });
}

function getClassConstructorSignature({
    declaration,
}: {
    declaration: tsm.ConstructorDeclaration;
}): string {
    const modifiers = declaration
        .getModifiers()
        .map((modifier) => modifier.getText())
        .join(' ');

    const params = declaration
        .getParameters()
        .map((param) => {
            const name = param.getName();
            const type = getApparentType({ declaration: param });
            const isRest = param.isRestParameter();
            const dotsToken = isRest ? '...' : '';
            const isOptional = param.isOptional();
            const questionToken = !isRest && isOptional ? '?' : '';
            return `${dotsToken}${name}${questionToken}: ${type}`;
        })
        .join(',');

    const signature = `${modifiers} constructor(${params});`;
    return formatClassMember(signature);
}

function getClassMembers({
    classID,
    classDeclaration,
    getSource,
    getType,
}: {
    classID: string;
    classDeclaration: tsm.ClassDeclaration;
    getSource: SourceProvider;
    getType: TypeChecker;
}): ClassMemberDeclarations {
    const seenMethods = new Set<string>();
    const members = [
        ...classDeclaration.getStaticMembers(),
        ...classDeclaration.getInstanceMembers(),
    ]
        .flatMap((declaration) => {
            const name = declaration.getName();
            const id = toID(classID, name);

            if (isInternalDeclaration({ declaration, name })) {
                return [];
            }

            if (
                tsm.Node.isPropertyDeclaration(declaration) ||
                tsm.Node.isParameterDeclaration(declaration)
            ) {
                return newProperty({ id, name, declaration, getSource });
            }

            if (tsm.Node.isGetAccessorDeclaration(declaration)) {
                return newGetAccessor({ id, name, declaration, getSource });
            }

            if (tsm.Node.isMethodDeclaration(declaration)) {
                // Skip overloaded methods
                if (seenMethods.has(id)) {
                    return [];
                }

                seenMethods.add(id);
                return newMethod({ id, name, declaration, getSource, getType });
            }

            return [];
        })
        .sort(sortByID);

    return {
        properties: members.filter(isClassPropertyDeclaration),
        methods: members.filter(isClassMethodDeclaration),
    };
}

function newProperty({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.PropertyDeclaration | tsm.ParameterDeclaration;
    getSource: SourceProvider;
}): ClassPropertyDeclaration {
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const modifiersText = getModifiersText({ declaration });
    const isStatic =
        tsm.Node.isPropertyDeclaration(declaration) && declaration.isStatic();
    const isOptional = declaration.hasQuestionToken();
    const optionalText = isOptional ? '?' : '';
    const type = getApparentType({ declaration });
    const signature = formatClassMember(
        `${modifiersText} ${name} ${optionalText}: ${type}`
    );

    return {
        kind: 'classProperty',
        id,
        name,
        docs,
        source,
        signature,
        isStatic,
        type,
    };
}

function newGetAccessor({
    id,
    name,
    declaration,
    getSource,
}: {
    id: string;
    name: string;
    declaration: tsm.GetAccessorDeclaration;
    getSource: SourceProvider;
}): ClassPropertyDeclaration {
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const isStatic = declaration.isStatic();
    const isReadonly = declaration.getSetAccessor() === undefined;
    const type = getApparentType({ declaration: declaration });
    const staticText = isStatic ? 'static' : '';
    const readonlyText = isReadonly ? 'readonly' : '';
    const signature = formatClassMember(
        `${staticText} ${readonlyText} ${name}: ${type}`
    );

    return {
        kind: 'classProperty',
        id,
        name,
        docs,
        source,
        signature,
        isStatic,
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
    declaration: tsm.MethodDeclaration;
    getSource: SourceProvider;
    getType: TypeChecker;
}): ClassMethodDeclaration {
    const docs = getJSDocs({ declaration });
    const source = getSource({ declaration });
    const isStatic = declaration.isStatic();
    const modifiersText = getModifiersText({ declaration });
    const type = getType({ declaration });
    const signature = formatClassMember(`${modifiersText} ${name}: ${type}`);

    return {
        kind: 'classMethod',
        id,
        name,
        docs,
        source,
        signature,
        isStatic,
        type,
    };
}
