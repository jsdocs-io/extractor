import {
  GetAccessorDeclaration,
  MethodDeclaration,
  Node,
  ParameterDeclaration,
  PropertyDeclaration,
  type ClassDeclaration,
  type ConstructorDeclaration,
} from "ts-morph";
import { apparentType } from "./apparent-type";
import { compareId } from "./compare-id";
import { docs } from "./docs";
import { formatSignature } from "./format-signature";
import { headText } from "./head-text";
import { id } from "./id";
import { isHidden } from "./is-hidden";
import { modifiersText } from "./modifiers-text";
import { sourceFilePath } from "./source-file-path";
import { typeCheckerType } from "./type-checker-type";

export type ExtractedClass = {
  kind: "class";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
  constructors: ExtractedClassConstructor[];
  properties: ExtractedClassProperty[];
  methods: ExtractedClassMethod[];
};

export type ExtractedClassConstructor = {
  kind: "class-constructor";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
};

export type ExtractedClassProperty = {
  kind: "class-property";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
};

export type ExtractedClassMethod = {
  kind: "class-method";
  id: string;
  name: string;
  docs: string[];
  file: string;
  line: number;
  signature: string;
};

export const extractClass = async (
  containerName: string,
  exportName: string,
  declaration: ClassDeclaration,
): Promise<ExtractedClass> => {
  const classId = id(containerName, "class", exportName);
  return {
    kind: "class",
    id: classId,
    name: exportName,
    docs: docs(declaration),
    file: sourceFilePath(declaration),
    line: declaration.getStartLineNumber(),
    signature: await classSignature(declaration),
    constructors: await extractClassConstructors(classId, declaration),
    properties: await extractClassProperties(classId, declaration),
    methods: await extractClassMethods(classId, declaration),
  };
};

const classSignature = (declaration: ClassDeclaration): Promise<string> => {
  const signature = headText(declaration);
  return formatSignature("class", signature);
};

const extractClassConstructors = async (
  classId: string,
  classDeclaration: ClassDeclaration,
): Promise<ExtractedClassConstructor[]> => {
  // Calling `getConstructors()` returns all constructors in ambient modules
  // but only the implementation constructor in normal modules.
  // We get the first constructor and then find all others starting from it.
  const declaration = classDeclaration.getConstructors()[0];
  if (!declaration) {
    // No constructors.
    return [];
  }
  const implementation = declaration.getImplementation();
  const constructorDeclarations = [
    ...(implementation ? [implementation] : []),
    ...declaration.getOverloads(),
  ];
  const constructors = [];
  for (const [index, declaration] of constructorDeclarations.entries()) {
    if (isHidden(declaration)) {
      continue;
    }
    constructors.push({
      kind: "class-constructor" as const,
      id: id(classId, "constructor", index > 0 ? `${index}` : ""),
      name: "constructor",
      docs: docs(declaration),
      file: sourceFilePath(declaration),
      line: declaration.getStartLineNumber(),
      signature: await classConstructorSignature(declaration),
    });
  }
  return constructors;
};

const classConstructorSignature = (
  declaration: ConstructorDeclaration,
): Promise<string> => {
  const modifiers = modifiersText(declaration);
  const params = declaration
    .getParameters()
    .map((param) => {
      const name = param.getName();
      const type = apparentType(param);
      const isRest = param.isRestParameter();
      const dotsToken = isRest ? "..." : "";
      const isOptional = param.isOptional();
      const questionToken = !isRest && isOptional ? "?" : "";
      return `${dotsToken}${name}${questionToken}: ${type}`;
    })
    .join(",");
  const signature = `${modifiers} constructor(${params});`;
  return formatSignature("class-constructor", signature);
};

const extractClassProperties = async (
  classId: string,
  classDeclaration: ClassDeclaration,
): Promise<ExtractedClassProperty[]> => {
  const propertiesDeclarations = [
    ...classDeclaration.getInstanceProperties(),
    ...classDeclaration.getStaticProperties(),
  ];
  const properties = [];
  for (const declaration of propertiesDeclarations) {
    if (isHidden(declaration) || Node.isSetAccessorDeclaration(declaration)) {
      continue;
    }
    const name = declaration.getName();
    properties.push({
      kind: "class-property" as const,
      id: id(classId, "property", name),
      name,
      docs: docs(declaration),
      file: sourceFilePath(declaration),
      line: declaration.getStartLineNumber(),
      signature: await classPropertySignature(name, declaration),
    });
  }
  return properties.sort(compareId);
};

const classPropertySignature = (
  name: string,
  declaration:
    | ParameterDeclaration
    | PropertyDeclaration
    | GetAccessorDeclaration,
): Promise<string> => {
  const type = apparentType(declaration);
  if (
    Node.isParameterDeclaration(declaration) ||
    Node.isPropertyDeclaration(declaration)
  ) {
    const modifiers = modifiersText(declaration);
    const optional = declaration.hasQuestionToken() ? "?" : "";
    const signature = `${modifiers} ${name}${optional}: ${type}`;
    return formatSignature("class-property", signature);
  }
  if (Node.isGetAccessorDeclaration(declaration)) {
    const staticKeyword = declaration.isStatic() ? "static" : "";
    const readonlyKeyword =
      declaration.getSetAccessor() === undefined ? "readonly" : "";
    const signature = `${staticKeyword} ${readonlyKeyword} ${name}: ${type}`;
    return formatSignature("class-property", signature);
  }
  const unreachable: never = declaration;
  throw new Error("unreachable", { cause: unreachable });
};

const extractClassMethods = async (
  classId: string,
  classDeclaration: ClassDeclaration,
): Promise<ExtractedClassMethod[]> => {
  const methodsDeclarations = [
    ...classDeclaration.getInstanceMethods(),
    ...classDeclaration.getStaticMethods(),
  ];
  const methods = [];
  const seenMethods = new Set<string>();
  for (const declaration of methodsDeclarations) {
    if (isHidden(declaration)) {
      continue;
    }
    const name = declaration.getName();
    if (seenMethods.has(name)) {
      // Skip overloaded methods.
      continue;
    }
    seenMethods.add(name);
    methods.push({
      kind: "class-method" as const,
      id: id(classId, "method", name),
      name,
      docs: docs(declaration),
      file: sourceFilePath(declaration),
      line: declaration.getStartLineNumber(),
      signature: await classMethodSignature(name, declaration),
    });
  }
  return methods.sort(compareId);
};

const classMethodSignature = (
  name: string,
  declaration: MethodDeclaration,
): Promise<string> => {
  const modifiers = modifiersText(declaration);
  const type = typeCheckerType(declaration);
  return formatSignature("class-method", `${modifiers} ${name}: ${type}`);
};
