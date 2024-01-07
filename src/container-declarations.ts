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
import { extractExpression } from "./extract-expression";
import { extractFunction } from "./extract-function";
import { extractFunctionExpression } from "./extract-function-expression";
import { extractTypeAlias } from "./extract-type-alias";
import { extractVariable } from "./extract-variable";
import { extractVariableAssignmentExpression } from "./extract-variable-assignment-expression";
import { globalAmbientDeclarations } from "./global-ambient-declarations";
import { isClass } from "./is-class";
import { isEnum } from "./is-enum";
import { isExpression } from "./is-expression";
import { isFunction } from "./is-function";
import { isFunctionExpression } from "./is-function-expression";
import { isInterface } from "./is-interface";
import { isModule } from "./is-module";
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
  return containerDeclarations;
};

const extractDeclaration = (
  containerName: string,
  exportName: string,
  declaration: ExportedDeclarations,
  maxDepth: number,
) => {
  switch (true) {
    case isVariable(declaration): {
      return extractVariable(containerName, exportName, declaration);
    }
    case isVariableAssignmentExpression(declaration): {
      return extractVariableAssignmentExpression(
        containerName,
        exportName,
        declaration,
      );
    }
    case isExpression(declaration): {
      return extractExpression(containerName, exportName, declaration);
    }
    case isFunction(declaration): {
      return extractFunction(containerName, exportName, declaration);
    }
    case isFunctionExpression(declaration): {
      return extractFunctionExpression(containerName, exportName, declaration);
    }
    case isClass(declaration): {
      return undefined;
    }
    case isInterface(declaration): {
      return undefined;
    }
    case isEnum(declaration): {
      return undefined;
    }
    case isTypeAlias(declaration): {
      return extractTypeAlias(containerName, exportName, declaration);
    }
    case isNamespace(declaration) && maxDepth > 0: {
      return undefined;
    }
    case isModule(declaration) && maxDepth > 0: {
      return undefined;
    }
    default: {
      return undefined;
    }
  }
};
