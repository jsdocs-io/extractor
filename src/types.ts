/** `BaseDeclaration` contains the properties common to extracted declarations. */
export interface BaseDeclaration {
	/** Unique ID. */
	id: string;

	/** Export name (may differ from the original name). */
	name: string;

	/** List of associated JSDoc comments. */
	docs: string[];

	/** Name of the file where the declaration is defined. */
	file: string;

	/** Line number where the declaration is defined. */
	line: number;

	/** Declaration signature. */
	signature: string;
}

export interface ExtractedVariable extends BaseDeclaration {
	kind: "variable";
}

export interface ExtractedFunction extends BaseDeclaration {
	kind: "function";
}

export interface ExtractedClass extends BaseDeclaration {
	kind: "class";
	constructors: ExtractedClassConstructor[];
	properties: ExtractedClassProperty[];
	methods: ExtractedClassMethod[];
}

export interface ExtractedClassConstructor extends BaseDeclaration {
	kind: "class-constructor";
}

export interface ExtractedClassProperty extends BaseDeclaration {
	kind: "class-property";
}

export interface ExtractedClassMethod extends BaseDeclaration {
	kind: "class-method";
}

export interface ExtractedInterface extends BaseDeclaration {
	kind: "interface";
	properties: ExtractedInterfaceProperty[];
	methods: ExtractedInterfaceMethod[];
	constructSignatures: ExtractedInterfaceConstructSignature[];
	callSignatures: ExtractedInterfaceCallSignature[];
	indexSignatures: ExtractedInterfaceIndexSignature[];
	getAccessors: ExtractedInterfaceGetAccessor[];
	setAccessors: ExtractedInterfaceSetAccessor[];
}

export interface ExtractedInterfaceProperty extends BaseDeclaration {
	kind: "interface-property";
}

export interface ExtractedInterfaceMethod extends BaseDeclaration {
	kind: "interface-method";
}

export interface ExtractedInterfaceConstructSignature extends BaseDeclaration {
	kind: "interface-construct-signature";
}

export interface ExtractedInterfaceCallSignature extends BaseDeclaration {
	kind: "interface-call-signature";
}

export interface ExtractedInterfaceIndexSignature extends BaseDeclaration {
	kind: "interface-index-signature";
}

export interface ExtractedInterfaceGetAccessor extends BaseDeclaration {
	kind: "interface-get-accessor";
}

export interface ExtractedInterfaceSetAccessor extends BaseDeclaration {
	kind: "interface-set-accessor";
}

export interface ExtractedEnum extends BaseDeclaration {
	kind: "enum";
	members: ExtractedEnumMember[];
}

export interface ExtractedEnumMember extends BaseDeclaration {
	kind: "enum-member";
}

export interface ExtractedTypeAlias extends BaseDeclaration {
	kind: "type";
}

export interface ExtractedNamespace extends BaseDeclaration {
	kind: "namespace";
	declarations: ExtractedDeclaration[];
}

/**
`ExtractedDeclaration` is the union of all possible top-level declarations
that can be extracted from a package, module, or namespace.
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
`ExtractedDeclarationKind` is the union of all literal discriminators
used to detect the kind of top-level declaration.
*/
export type ExtractedDeclarationKind = ExtractedDeclaration["kind"];

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
`AllExtractedDeclarationKind` is the union of all literal discriminators
used to detect the kind of declaration.
*/
export type AllExtractedDeclarationKind = AllExtractedDeclaration["kind"];
