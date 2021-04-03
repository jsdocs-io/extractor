import * as tsm from 'ts-morph';
import {
    isClassDeclaration,
    isEnumDeclaration,
    isFunctionDeclaration,
    isInterfaceDeclaration,
    isNamespaceDeclaration,
    isTypeAliasDeclaration,
    isVariableDeclaration,
} from '../types/declaration-type-guards';
import { ModuleDeclarations } from '../types/module-declarations';
import { log } from '../utils/log';
import { isClass, newClass } from './classes';
import { isEnum, newEnum } from './enums';
import {
    isExpression,
    isVariableAssignmentExpression,
    newExpression,
    newVariableAssignmentExpression,
} from './expression';
import { isFileModule, newFileModule } from './file-modules';
import {
    isFunction,
    isFunctionExpression,
    newFunction,
    newFunctionExpression,
} from './functions';
import { getDeclarationName } from './get-declaration-name';
import { isInterface, newInterface } from './interfaces';
import { isExportedDeclarations } from './is-exported-declarations';
import { isGlobalDeclaration } from './is-global-declaration';
import { isInternalDeclaration } from './is-internal-declaration';
import { isNamespace, newNamespace } from './namespaces';
import { sortByID } from './sort-by-id';
import { SourceProvider } from './source-provider';
import { toID } from './to-id';
import { isTypeAlias, newTypeAlias } from './type-aliases';
import { TypeChecker } from './type-checker';
import { isVariable, newVariable } from './variables';

type Module = tsm.SourceFile | tsm.ModuleDeclaration;

interface ExportedDeclaration {
    readonly exportID: string;
    readonly exportName: string;
    readonly declarationID: string;
    readonly declarationName: string;
    readonly declaration: tsm.ExportedDeclarations;
}

export function getPackageDeclarations({
    project,
    indexFile,
    getSource,
    getType,
    maxDepth = 5,
}: {
    project: tsm.Project;
    indexFile: tsm.SourceFile;
    getSource: SourceProvider;
    getType: TypeChecker;
    maxDepth?: number;
}): ModuleDeclarations {
    return getModuleDeclarations({
        module: indexFile,
        moduleName: '',
        maxDepth,
        getSource,
        getType,
        project,
    });
}

/**
 * `getModuleDeclarations` extracts the public declarations from the given module.
 *
 * @param module - module (for example, a source file, node or namespace)
 * @param maxDepth - maximum extraction depth for inner modules
 * @param getSource - source provider
 * @param getType - type checker
 * @param moduleName - module's name, used to define IDs for declarations (optional)
 */
export function getModuleDeclarations({
    module,
    moduleName,
    maxDepth,
    getSource,
    getType,
    project,
}: {
    module: Module;
    moduleName: string;
    maxDepth: number;
    getSource: SourceProvider;
    getType: TypeChecker;
    project?: tsm.Project;
}): ModuleDeclarations {
    log('getModuleDeclarations: extracting declarations: %O', {
        moduleName,
        maxDepth,
        module,
    });

    const normalExportDeclarations = getNormalExportDeclarations({
        module,
        moduleName,
    });
    log('getModuleDeclarations: got normal export declarations: %O', {
        moduleName,
        total: normalExportDeclarations.length,
        normalExportDeclarations,
    });

    const exportEqualsDeclarations = getExportEqualsDeclarations({
        module,
        moduleName,
    });
    log('getModuleDeclarations: got export equals declarations: %O', {
        moduleName,
        total: exportEqualsDeclarations.length,
        exportEqualsDeclarations,
    });

    const ambientModulesDeclarations = getAmbientModulesDeclarations({
        project,
    });
    log('getModuleDeclarations: got ambient modules declarations: %O', {
        moduleName,
        total: ambientModulesDeclarations.length,
        ambientModulesDeclarations,
    });

    const globalAmbientDeclarations = getGlobalAmbientDeclarations({
        module,
        moduleName,
    });
    log('getModuleDeclarations: got global ambient declarations: %O', {
        moduleName,
        total: globalAmbientDeclarations.length,
        globalAmbientDeclarations,
    });

    return extractModuleDeclarations({
        exportedDeclarations: [
            ...normalExportDeclarations,
            ...exportEqualsDeclarations,
            ...ambientModulesDeclarations,
            ...globalAmbientDeclarations,
        ],
        maxDepth,
        getSource,
        getType,
    });
}

function getNormalExportDeclarations({
    module,
    moduleName,
}: {
    module: Module;
    moduleName: string;
}): ExportedDeclaration[] {
    const namedExports = new Set<string>();

    return Array.from(module.getExportedDeclarations())
        .flatMap(([exportName, declarations]) => {
            return declarations.flatMap((declaration) => {
                // Skip internal/private declarations
                if (isInternalDeclaration({ declaration, name: exportName })) {
                    return [];
                }

                const exportID = toID(moduleName, exportName);
                const declarationName = getDeclarationName({
                    exportName,
                    declaration,
                });
                const declarationID = toID(moduleName, declarationName);

                // Keep track of named exports for the filter step
                if (declarationID === exportID) {
                    namedExports.add(declarationID);
                }

                return {
                    exportID,
                    exportName,
                    declarationID,
                    declarationName,
                    declaration,
                };
            });
        })
        .filter(({ exportID, declarationID }) => {
            // Keep only named exports or default exports
            // with no corresponding named export
            return (
                declarationID === exportID || !namedExports.has(declarationID)
            );
        });
}

function getExportEqualsDeclarations({
    module,
    moduleName,
}: {
    module: Module;
    moduleName: string;
}): ExportedDeclaration[] {
    // Skip shorthand ambient modules without body
    // (for example, `declare module 'foo';`)
    if (tsm.Node.isModuleDeclaration(module) && !module.hasBody()) {
        return [];
    }

    const exportIdentifier = module
        .getExportAssignment((ea) => ea.isExportEquals())
        ?.getLastChildByKind(tsm.SyntaxKind.Identifier);
    if (!exportIdentifier) {
        return [];
    }

    const exportName = exportIdentifier.getText();

    return exportIdentifier.getDefinitionNodes().flatMap((declaration) => {
        // Skip internal or unsupported declarations
        if (
            isInternalDeclaration({ declaration, name: exportName }) ||
            !isExportedDeclarations(declaration)
        ) {
            return [];
        }

        // Skip namespaces since `getNormalExportDeclarations` already extracts
        // the inner declarations of an export equals namespace
        // as non-namespaced declarations belonging to the parent module.
        // See snapshot for `export-equals-function-and-namespace.test.ts`.
        if (isNamespace(declaration)) {
            return [];
        }

        const exportID = toID(moduleName, exportName);
        const declarationName = getDeclarationName({
            exportName,
            declaration,
        });
        const declarationID = toID(moduleName, declarationName);

        return {
            exportID,
            exportName,
            declarationID,
            declarationName,
            declaration,
        };
    });
}

function getAmbientModulesDeclarations({
    project,
}: {
    project?: tsm.Project;
}): ExportedDeclaration[] {
    if (!project) {
        return [];
    }

    return project.getAmbientModules().flatMap((symbol) => {
        return symbol.getDeclarations().flatMap((declaration) => {
            const filepath = declaration.getSourceFile().getFilePath();
            if (
                !tsm.Node.isModuleDeclaration(declaration) ||
                filepath.startsWith('/node_modules')
            ) {
                return [];
            }

            const exportName = declaration.getName();
            const declarationName = exportName;

            // Remove surrounding quotes and eventual spaces
            const exportID = exportName
                .replace(/"|'/g, '')
                .replace(/\s/g, '_')
                .trim();
            const declarationID = exportID;

            return {
                exportID,
                exportName,
                declarationID,
                declarationName,
                declaration,
            };
        });
    });
}

function getGlobalAmbientDeclarations({
    module,
    moduleName,
}: {
    module: Module;
    moduleName: string;
}): ExportedDeclaration[] {
    if (!tsm.Node.isSourceFile(module)) {
        return [];
    }

    // See https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#global-variables
    const globalCandidates = [
        ...module.getVariableDeclarations(),
        ...module.getFunctions(),
        ...module.getModules(),
    ];

    return globalCandidates.flatMap((declaration) => {
        // Global ambient functions must have a name
        const exportName = declaration.getName()!;

        if (
            !isGlobalDeclaration({ declaration }) ||
            isInternalDeclaration({ declaration, name: exportName })
        ) {
            return [];
        }

        const exportID = toID(moduleName, exportName);
        const declarationName = getDeclarationName({
            exportName,
            declaration,
        });
        const declarationID = toID(moduleName, declarationName);

        return {
            exportID,
            exportName,
            declarationID,
            declarationName,
            declaration,
        };
    });
}

function extractModuleDeclarations({
    exportedDeclarations,
    maxDepth,
    getSource,
    getType,
}: {
    exportedDeclarations: ExportedDeclaration[];
    maxDepth: number;
    getSource: SourceProvider;
    getType: TypeChecker;
}): ModuleDeclarations {
    const exportedFunctions = new Set<string>();
    const exportedNamespaces = new Set<string>();

    const declarations = exportedDeclarations
        .flatMap(
            ({
                exportID,
                declarationID: id,
                declarationName: name,
                declaration,
            }) => {
                if (isVariable(declaration)) {
                    return newVariable({ id, name, declaration, getSource });
                }

                if (isVariableAssignmentExpression(declaration)) {
                    return newVariableAssignmentExpression({
                        id,
                        name,
                        declaration,
                        getSource,
                    });
                }

                if (isExpression(declaration)) {
                    return newExpression({ id, name, declaration, getSource });
                }

                if (isFunction(declaration)) {
                    // Skip ambient function overloads
                    if (exportedFunctions.has(exportID)) {
                        return [];
                    }

                    exportedFunctions.add(exportID);
                    return newFunction({
                        id,
                        name,
                        declaration,
                        getSource,
                        getType,
                    });
                }

                if (isFunctionExpression(declaration)) {
                    return newFunctionExpression({
                        id,
                        name,
                        declaration,
                        getSource,
                        getType,
                    });
                }

                if (isClass(declaration)) {
                    return newClass({
                        id,
                        name,
                        declaration,
                        getSource,
                        getType,
                    });
                }

                if (isInterface(declaration)) {
                    return newInterface({
                        id,
                        name,
                        declaration,
                        getSource,
                        getType,
                    });
                }

                if (isEnum(declaration)) {
                    return newEnum({ id, name, declaration, getSource });
                }

                if (isTypeAlias(declaration)) {
                    return newTypeAlias({ id, name, declaration, getSource });
                }

                if (isNamespace(declaration) && maxDepth > 0) {
                    // Skip merged or nested namespace declarations
                    if (exportedNamespaces.has(exportID)) {
                        return [];
                    }

                    const declarations = getModuleDeclarations({
                        module: declaration,
                        moduleName: id,
                        maxDepth: maxDepth - 1,
                        getSource,
                        getType,
                    });

                    exportedNamespaces.add(exportID);
                    return newNamespace({
                        id,
                        name,
                        declaration,
                        declarations,
                        getSource,
                    });
                }

                // From `import * as ns from module; export { ns };`
                // or from `export * as ns from module`.
                if (isFileModule(declaration) && maxDepth > 0) {
                    const declarations = getModuleDeclarations({
                        module: declaration,
                        moduleName: id,
                        maxDepth: maxDepth - 1,
                        getSource,
                        getType,
                    });

                    return newFileModule({
                        id,
                        name,
                        declaration,
                        declarations,
                        getSource,
                    });
                }

                return [];
            }
        )
        .sort(sortByID);

    return {
        variables: declarations.filter(isVariableDeclaration),
        functions: declarations.filter(isFunctionDeclaration),
        classes: declarations.filter(isClassDeclaration),
        interfaces: declarations.filter(isInterfaceDeclaration),
        enums: declarations.filter(isEnumDeclaration),
        typeAliases: declarations.filter(isTypeAliasDeclaration),
        namespaces: declarations.filter(isNamespaceDeclaration),
    };
}
