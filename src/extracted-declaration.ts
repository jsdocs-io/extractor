import type {
  ExtractedClass,
  ExtractedClassConstructor,
  ExtractedClassMethod,
  ExtractedClassProperty,
} from "./extract-class";
import type { ExtractedEnum, ExtractedEnumMember } from "./extract-enum";
import type { ExtractedFunction } from "./extract-function";
import type {
  ExtractedInterface,
  ExtractedInterfaceCallSignature,
  ExtractedInterfaceConstructSignature,
  ExtractedInterfaceGetAccessor,
  ExtractedInterfaceIndexSignature,
  ExtractedInterfaceMethod,
  ExtractedInterfaceProperty,
  ExtractedInterfaceSetAccessor,
} from "./extract-interface";
import type { ExtractedNamespace } from "./extract-namespace";
import type { ExtractedTypeAlias } from "./extract-type-alias";
import type { ExtractedVariable } from "./extract-variable";

export type ExtractedDeclaration =
  | ExtractedVariable
  | ExtractedFunction
  | ExtractedClass
  | ExtractedClassConstructor
  | ExtractedClassProperty
  | ExtractedClassMethod
  | ExtractedInterface
  | ExtractedInterfaceProperty
  | ExtractedInterfaceMethod
  | ExtractedInterfaceConstructSignature
  | ExtractedInterfaceCallSignature
  | ExtractedInterfaceIndexSignature
  | ExtractedInterfaceGetAccessor
  | ExtractedInterfaceSetAccessor
  | ExtractedEnum
  | ExtractedEnumMember
  | ExtractedTypeAlias
  | ExtractedNamespace;

export type ExtractedDeclarationKind = ExtractedDeclaration["kind"];
