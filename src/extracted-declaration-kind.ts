export type ExtractedDeclarationKind =
  | "variable"
  | "function"
  | "class"
  | "class-constructor"
  | "class-property"
  | "class-method"
  | "interface"
  | "interface-property"
  | "interface-method"
  | "interface-construct-signature"
  | "interface-call-signature"
  | "interface-index-signature"
  | "interface-get-accessor"
  | "interface-set-accessor"
  | "enum"
  | "enum-member"
  | "type-alias"
  | "namespace";
