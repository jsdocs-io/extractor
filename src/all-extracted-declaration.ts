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

/**
`AllExtractedDeclaration` is the union of all possible declarations
that can be extracted, with some being found only in other declarations
(e.g., class method declarations are found only in a class declaration).
*/
export type AllExtractedDeclaration =
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

/**
`AllExtractedDeclarationKind` is the union of all discriminators
used to detect the kind of declaration.
*/
export type AllExtractedDeclarationKind = AllExtractedDeclaration["kind"];
