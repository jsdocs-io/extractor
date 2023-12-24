import {
  Node,
  SyntaxKind,
  type ModuleDeclaration,
  type Project,
  type SourceFile,
} from "ts-morph";
import { exportedDeclarationName } from "./exported-declaration-name";
import { isGlobalDeclaration } from "./is-global-declaration";
import { isInternalNode } from "./is-internal-node";
import { itemId } from "./item-id";
import { nodeIsExportedDeclarations } from "./node-is-exported-declarations";

export type ContainerDeclarationsOptions = {
  project: Project;
  container: DeclarationsContainer;
  containerName: string;
  maxDepth: number;
};

export type DeclarationsContainer = SourceFile | ModuleDeclaration;

export const containerDeclarations = ({
  project,
  container,
  containerName,
  maxDepth,
}: ContainerDeclarationsOptions) =>
  extractContainerDeclarations({
    declarations: [
      ...exportedDeclarations(container, containerName),
      ...exportEqualsDeclarations(container, containerName),
      ...ambientModulesDeclarations(project),
      ...globalAmbientDeclarations(container, containerName),
    ],
    maxDepth,
  });

const exportedDeclarations = (
  container: DeclarationsContainer,
  containerName: string,
) =>
  [...container.getExportedDeclarations()].flatMap(
    ([exportName, declarations]) =>
      declarations.flatMap((declaration) => {
        // Skip internal and private declarations.
        if (isInternalNode(declaration, exportName)) {
          return [];
        }
        const declarationName = exportedDeclarationName(
          exportName,
          declaration,
        );
        return {
          exportId: itemId(containerName, exportName),
          exportName,
          declarationId: itemId(containerName, declarationName),
          declarationName,
          declaration,
        };
      }),
  );

const exportEqualsDeclarations = (
  container: DeclarationsContainer,
  containerName: string,
) => {
  // Skip shorthand ambient modules without body (e.g., `declare module 'foo';`).
  if (Node.isModuleDeclaration(container) && !container.hasBody()) {
    return [];
  }
  const exportIdentifier = container
    .getExportAssignment((ea) => ea.isExportEquals())
    ?.getLastChildByKind(SyntaxKind.Identifier);
  if (!exportIdentifier) {
    return [];
  }
  const exportName = exportIdentifier.getText();
  return exportIdentifier.getDefinitionNodes().flatMap((declaration) => {
    // Skip internal or unsupported declarations.
    if (
      isInternalNode(declaration, exportName) ||
      !nodeIsExportedDeclarations(declaration)
    ) {
      return [];
    }

    // Skip namespaces since `exportDeclarations` already extracts
    // the inner declarations of an export equals namespace as
    // non-namespaced declarations belonging to the parent container.
    // See snapshot for `export-equals-function-and-namespace.test.ts`.
    if (Node.isModuleDeclaration(declaration)) {
      return [];
    }
    const declarationName = exportedDeclarationName(exportName, declaration);
    return {
      exportId: itemId(containerName, exportName),
      exportName,
      declarationId: itemId(containerName, declarationName),
      declarationName,
      declaration,
    };
  });
};

const ambientModulesDeclarations = (project: Project) =>
  project.getAmbientModules().flatMap((symbol) => {
    return symbol.getDeclarations().flatMap((declaration) => {
      const filepath = declaration.getSourceFile().getFilePath();
      if (
        !Node.isModuleDeclaration(declaration) ||
        // TODO:
        filepath.startsWith("/node_modules")
      ) {
        return [];
      }
      const exportName = declaration.getName();
      const declarationName = exportName;

      // Remove surrounding quotes and eventual spaces
      const exportID = exportName
        .replace(/"|'/g, "")
        .replace(/\s/g, "_")
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

const globalAmbientDeclarations = (
  container: DeclarationsContainer,
  containerName: string,
) => {
  if (!Node.isSourceFile(container)) {
    return [];
  }

  // See https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#global-variables
  const globalCandidates = [
    ...container.getVariableDeclarations(),
    ...container.getFunctions(),
    ...container.getModules(),
  ];

  return globalCandidates.flatMap((declaration) => {
    // Global ambient functions must have a name
    const exportName = declaration.getName()!;
    if (
      !isGlobalDeclaration(declaration) ||
      isInternalNode(declaration, exportName)
    ) {
      return [];
    }
    const declarationName = exportedDeclarationName(exportName, declaration);
    return {
      exportId: itemId(containerName, exportName),
      exportName,
      declarationId: itemId(containerName, declarationName),
      declarationName,
      declaration,
    };
  });
};

// TODO:
const extractContainerDeclarations = ({
  declarations,
  maxDepth,
  // getSource,
  // getType,
}: {
  // exportedDeclarations: ExportedDeclaration[];
  declarations: unknown[];
  maxDepth: number;
  // getSource: SourceProvider;
  // getType: TypeChecker;
  // }): ModuleDeclarations => {
}): unknown => {
  return undefined;
};
//   const exportedFunctions = new Set<string>();
//   const exportedNamespaces = new Set<string>();

//   const declarations = exportedDeclarations
//     .flatMap(
//       ({ exportID, declarationID: id, declarationName: name, declaration }) => {
//         if (isVariable(declaration)) {
//           return newVariable({ id, name, declaration, getSource });
//         }

//         if (isVariableAssignmentExpression(declaration)) {
//           return newVariableAssignmentExpression({
//             id,
//             name,
//             declaration,
//             getSource,
//           });
//         }

//         if (isExpression(declaration)) {
//           return newExpression({ id, name, declaration, getSource });
//         }

//         if (isFunction(declaration)) {
//           // Skip ambient function overloads
//           if (exportedFunctions.has(exportID)) {
//             return [];
//           }

//           exportedFunctions.add(exportID);
//           return newFunction({
//             id,
//             name,
//             declaration,
//             getSource,
//             getType,
//           });
//         }

//         if (isFunctionExpression(declaration)) {
//           return newFunctionExpression({
//             id,
//             name,
//             declaration,
//             getSource,
//             getType,
//           });
//         }

//         if (isClass(declaration)) {
//           return newClass({
//             id,
//             name,
//             declaration,
//             getSource,
//             getType,
//           });
//         }

//         if (isInterface(declaration)) {
//           return newInterface({
//             id,
//             name,
//             declaration,
//             getSource,
//             getType,
//           });
//         }

//         if (isEnum(declaration)) {
//           return newEnum({ id, name, declaration, getSource });
//         }

//         if (isTypeAlias(declaration)) {
//           return newTypeAlias({ id, name, declaration, getSource });
//         }

//         if (isNamespace(declaration) && maxDepth > 0) {
//           // Skip merged or nested namespace declarations
//           if (exportedNamespaces.has(exportID)) {
//             return [];
//           }

//           const declarations = getModuleDeclarations({
//             module: declaration,
//             moduleName: id,
//             maxDepth: maxDepth - 1,
//             getSource,
//             getType,
//           });

//           exportedNamespaces.add(exportID);
//           return newNamespace({
//             id,
//             name,
//             declaration,
//             declarations,
//             getSource,
//           });
//         }

//         // From `import * as ns from module; export { ns };`
//         // or from `export * as ns from module`.
//         if (isFileModule(declaration) && maxDepth > 0) {
//           const declarations = getModuleDeclarations({
//             module: declaration,
//             moduleName: id,
//             maxDepth: maxDepth - 1,
//             getSource,
//             getType,
//           });

//           return newFileModule({
//             id,
//             name,
//             declaration,
//             declarations,
//             getSource,
//           });
//         }

//         return [];
//       },
//     )
//     .sort(sortByID);

//   return {
//     variables: declarations.filter(isVariableDeclaration),
//     functions: declarations.filter(isFunctionDeclaration),
//     classes: declarations.filter(isClassDeclaration),
//     interfaces: declarations.filter(isInterfaceDeclaration),
//     enums: declarations.filter(isEnumDeclaration),
//     typeAliases: declarations.filter(isTypeAliasDeclaration),
//     namespaces: declarations.filter(isNamespaceDeclaration),
//   };
// };
