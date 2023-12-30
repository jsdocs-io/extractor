import {
  Node,
  type ModuleDeclaration,
  type Project,
  type SourceFile,
} from "ts-morph";
import { ambientModulesDeclarations } from "./ambient-modules-declarations";
import { exportEqualsDeclarations } from "./export-equals-declarations";
import { exportedDeclarations } from "./exported-declarations";
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

export const containerDeclarations = ({
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
  const containerDeclarations: unknown[] = [];
  for (const { containerName, exportName, declaration } of foundDeclarations) {
    switch (true) {
      case isVariable(declaration): {
      }
      case isVariableAssignmentExpression(declaration): {
      }
      case isExpression(declaration): {
      }
      case isFunction(declaration): {
      }
      case isFunctionExpression(declaration): {
      }
      case isClass(declaration): {
      }
      case isInterface(declaration): {
      }
      case isEnum(declaration): {
      }
      case isTypeAlias(declaration): {
      }
      case isNamespace(declaration) && maxDepth > 0: {
      }
      case isModule(declaration) && maxDepth > 0: {
      }
      default: {
      }
    }
  }
  return containerDeclarations;
};
