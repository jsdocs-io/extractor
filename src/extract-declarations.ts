import { orderBy } from "natural-orderby";
import {
  Node,
  type ExportedDeclarations,
  type ModuleDeclaration,
  type Project,
  type SourceFile,
} from "ts-morph";
import { ambientModulesDeclarations } from "./ambient-modules-declarations";
import { exportEqualsDeclarations } from "./export-equals-declarations";
import { exportedDeclarations } from "./exported-declarations";
import { extractClass, type ExtractedClass } from "./extract-class";
import { extractEnum, type ExtractedEnum } from "./extract-enum";
import { extractExpression } from "./extract-expression";
import { extractFileModule } from "./extract-file-module";
import { extractFunction, type ExtractedFunction } from "./extract-function";
import { extractFunctionExpression } from "./extract-function-expression";
import { extractInterface, type ExtractedInterface } from "./extract-interface";
import { extractNamespace, type ExtractedNamespace } from "./extract-namespace";
import {
  extractTypeAlias,
  type ExtractedTypeAlias,
} from "./extract-type-alias";
import { extractVariable, type ExtractedVariable } from "./extract-variable";
import { extractVariableAssignmentExpression } from "./extract-variable-assignment-expression";
import { globalAmbientDeclarations } from "./global-ambient-declarations";
import { id } from "./id";
import { isClass } from "./is-class";
import { isEnum } from "./is-enum";
import { isExpression } from "./is-expression";
import { isFileModule } from "./is-file-module";
import { isFunction } from "./is-function";
import { isFunctionExpression } from "./is-function-expression";
import { isInterface } from "./is-interface";
import { isNamespace } from "./is-namespace";
import { isTypeAlias } from "./is-type-alias";
import { isVariable } from "./is-variable";
import { isVariableAssignmentExpression } from "./is-variable-assignment-expression";

/**
`ExtractDeclarationsOptions` contains all the options
for calling {@link extractDeclarations}.

@internal
*/
export type ExtractDeclarationsOptions = {
  /**
  Name of the container that contains the top-level declarations
  (e.g., a namespace's name). This is used to generate declaration IDs.
  */
  containerName: string;

  /** Container that contains the top-level declarations. */
  container: SourceFile | ModuleDeclaration;

  /** Maximum extraction depth for nested namespaces. */
  maxDepth: number;

  /**
  Instance of a  `ts-morph` `Project`. This is used to find ambient modules.
  */
  project?: Project;

  /**
  Name of the package being analyzed. This is used to filter ambient modules.
  */
  pkgName?: string;
};

/**
`ExtractedDeclaration` is the union of all possible top-level declarations
that can be extracted from a package, module or namespace.
*/
export type ExtractedDeclaration =
  | ExtractedVariable
  | ExtractedFunction
  | ExtractedClass
  | ExtractedInterface
  | ExtractedEnum
  | ExtractedTypeAlias
  | ExtractedNamespace;

/**
`ExtractedDeclarationKind` is the union of all discriminators
used to detect the kind of top-level declaration.
*/
export type ExtractedDeclarationKind = ExtractedDeclaration["kind"];

/**
`extractDeclarations` extracts the top-level declarations found in a container
and/or a project.

@param options - {@link ExtractDeclarationsOptions}

@internal
*/
export const extractDeclarations = async ({
  containerName,
  container,
  maxDepth,
  project,
  pkgName,
}: ExtractDeclarationsOptions): Promise<ExtractedDeclaration[]> => {
  const foundDeclarations = [
    ...exportedDeclarations(containerName, container),
    ...exportEqualsDeclarations(containerName, container),
    ...(project
      ? ambientModulesDeclarations(containerName, project, pkgName)
      : []),
    ...(Node.isSourceFile(container)
      ? globalAmbientDeclarations(containerName, container)
      : []),
  ];
  const seenFunctions = new Set<string>();
  const seenNamespaces = new Set<string>();
  const extractedDeclarations = [];
  for (const { containerName, exportName, declaration } of foundDeclarations) {
    const extractedDeclaration = await extractDeclaration({
      containerName,
      exportName,
      declaration,
      maxDepth,
      seenFunctions,
      seenNamespaces,
    });
    if (!extractedDeclaration) {
      continue;
    }
    extractedDeclarations.push(extractedDeclaration);
  }
  return orderBy(extractedDeclarations, "id");
};

type ExtractDeclarationOptions = {
  containerName: string;
  exportName: string;
  declaration: ExportedDeclarations;
  maxDepth: number;
  seenFunctions: Set<string>;
  seenNamespaces: Set<string>;
};

const extractDeclaration = async ({
  containerName,
  exportName,
  declaration,
  maxDepth,
  seenFunctions,
  seenNamespaces,
}: ExtractDeclarationOptions): Promise<ExtractedDeclaration | undefined> => {
  if (isVariable(declaration)) {
    return extractVariable(containerName, exportName, declaration);
  }
  if (isVariableAssignmentExpression(declaration)) {
    return extractVariableAssignmentExpression(
      containerName,
      exportName,
      declaration,
    );
  }
  if (isExpression(declaration)) {
    return extractExpression(containerName, exportName, declaration);
  }
  if (isFunction(declaration)) {
    if (seenFunctions.has(exportName)) {
      // Skip function overloads, since an extracted function already contains
      // the docs and signatures of the implementation and all the overloads.
      return undefined;
    }
    seenFunctions.add(exportName);
    return extractFunction(containerName, exportName, declaration);
  }
  if (isFunctionExpression(declaration)) {
    return extractFunctionExpression(containerName, exportName, declaration);
  }
  if (isClass(declaration)) {
    return extractClass(containerName, exportName, declaration);
  }
  if (isInterface(declaration)) {
    return extractInterface(containerName, exportName, declaration);
  }
  if (isEnum(declaration)) {
    return extractEnum(containerName, exportName, declaration);
  }
  if (isTypeAlias(declaration)) {
    return extractTypeAlias(containerName, exportName, declaration);
  }
  if (isNamespace(declaration) && maxDepth > 0) {
    if (seenNamespaces.has(exportName)) {
      // Skip merged or nested namespaces, since an extracted namespace already
      // contains all the declarations found in the same namespace.
      return undefined;
    }
    seenNamespaces.add(exportName);
    const innerDeclarations = await extractDeclarations({
      containerName: id(containerName, "namespace", exportName),
      container: declaration,
      maxDepth: maxDepth - 1,
    });
    return extractNamespace(
      containerName,
      exportName,
      declaration,
      innerDeclarations,
    );
  }
  if (isFileModule(declaration) && maxDepth > 0) {
    // A file module declaration happens with the following export forms:
    // `import * as ns from module; export { ns };` or
    // `export * as ns from module`.
    const innerDeclarations = await extractDeclarations({
      containerName: id(containerName, "namespace", exportName),
      container: declaration,
      maxDepth: maxDepth - 1,
    });
    return extractFileModule(
      containerName,
      exportName,
      declaration,
      innerDeclarations,
    );
  }
  return undefined;
};
