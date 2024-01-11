import {
  Node,
  type ExportedDeclarations,
  type ModuleDeclaration,
  type Project,
  type SourceFile,
} from "ts-morph";
import { ambientModulesDeclarations } from "./ambient-modules-declarations";
import { compareId } from "./compare-id";
import { exportEqualsDeclarations } from "./export-equals-declarations";
import { exportedDeclarations } from "./exported-declarations";
import { extractClass } from "./extract-class";
import { extractEnum } from "./extract-enum";
import { extractExpression } from "./extract-expression";
import { extractFileModule } from "./extract-file-module";
import { extractFunction } from "./extract-function";
import { extractFunctionExpression } from "./extract-function-expression";
import { extractInterface } from "./extract-interface";
import { extractNamespace } from "./extract-namespace";
import { extractTypeAlias } from "./extract-type-alias";
import { extractVariable } from "./extract-variable";
import { extractVariableAssignmentExpression } from "./extract-variable-assignment-expression";
import { globalAmbientDeclarations } from "./global-ambient-declarations";
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

export type ContainerDeclarationsOptions = {
  project: Project;
  container: SourceFile | ModuleDeclaration;
  containerName: string;
  maxDepth: number;
  extractAmbientModules?: boolean;
};

export const containerDeclarations = async ({
  project,
  container,
  containerName,
  maxDepth,
  extractAmbientModules = false,
}: ContainerDeclarationsOptions) => {
  const foundDeclarations = [
    ...exportedDeclarations(container, containerName),
    ...exportEqualsDeclarations(container, containerName),
    ...(extractAmbientModules
      ? ambientModulesDeclarations(project, containerName)
      : []),
    ...(Node.isSourceFile(container)
      ? globalAmbientDeclarations(container, containerName)
      : []),
  ];
  const containerDeclarations = [];
  for (const { containerName, exportName, declaration } of foundDeclarations) {
    containerDeclarations.push(
      await extractDeclaration(
        containerName,
        exportName,
        declaration,
        maxDepth,
      ),
    );
  }
  return containerDeclarations.sort(compareId);
};

const extractDeclaration = (
  containerName: string,
  exportName: string,
  declaration: ExportedDeclarations,
  maxDepth: number,
) => {
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
    // TODO: // Skip merged or nested namespace declarations
    // TODO: extract inner declarations
    const innerDeclarations: unknown[] = [];
    return extractNamespace(
      containerName,
      exportName,
      declaration,
      innerDeclarations,
    );
  }
  if (isFileModule(declaration) && maxDepth > 0) {
    // From `import * as ns from module; export { ns };`
    // or from `export * as ns from module`.
    // TODO: extract inner declarations
    const innerDeclarations: unknown[] = [];
    return extractFileModule(
      containerName,
      exportName,
      declaration,
      innerDeclarations,
    );
  }
  return { id: "TODO:" };
};
