/**
 * `DeclarationKind` represents the possible kinds of declarations.
 */
export type DeclarationKind =
  | "variable"
  | "function"
  | "class"
  | "classConstructor"
  | "classProperty"
  | "classMethod"
  | "interface"
  | "interfaceProperty"
  | "interfaceMethod"
  | "interfaceConstructSignature"
  | "interfaceCallSignature"
  | "interfaceIndexSignature"
  | "enum"
  | "enumMember"
  | "typeAlias"
  | "namespace";
