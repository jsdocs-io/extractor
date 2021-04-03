/**
 * `ModuleDeclarations` contains the different kinds of declarations
 * exported by a module (for example, a package, a module (file) or a namespace).
 */
export interface ModuleDeclarations {
    readonly variables: VariableDeclaration[];
    readonly functions: FunctionDeclaration[];
    readonly classes: ClassDeclaration[];
    readonly interfaces: InterfaceDeclaration[];
    readonly enums: EnumDeclaration[];
    readonly typeAliases: TypeAliasDeclaration[];
    readonly namespaces: NamespaceDeclaration[];
}

/**
 * `VariableDeclaration` represents a variable declaration
 * (for example, `const myVar = ...`).
 */
export interface VariableDeclaration extends Declaration {
    readonly kind: DeclarationKinds.VariableDeclaration;

    /** Either `var`, `let`, or `const` */
    readonly variableKind: string;

    /** Variable type (for example, `string`) */
    readonly type: string;
}

/**
 * `FunctionDeclaration` represents a normal function declaration
 * (for example, `function myFunc() {...}`)
 * or a named function expression
 * (for example, `const myFunc = () => {...}` or
 * `const myFunc = function() {...}`).
 */
export interface FunctionDeclaration extends Declaration {
    readonly kind: DeclarationKinds.FunctionDeclaration;

    /** Function type (for example, `() => string`) */
    readonly type: string;
}

/**
 * `ClassDeclaration` represents a class declaration
 * (for example, `class MyClass {...}`).
 */
export interface ClassDeclaration extends Declaration {
    readonly kind: DeclarationKinds.ClassDeclaration;

    /** If `true`, the class is abstract */
    readonly isAbstract: boolean;

    /** Class constructors */
    readonly constructors: ClassConstructorDeclaration[];

    /** Class members */
    readonly members: ClassMemberDeclarations;
}

/**
 * `ClassConstructorDeclaration` represents a constructor declaration
 * belonging to a class (for example, `constructor() {...}`).
 */
export interface ClassConstructorDeclaration extends Declaration {
    readonly kind: DeclarationKinds.ClassConstructorDeclaration;
}

/**
 * `ClassMemberDeclarations` contains the members of a class.
 */
export interface ClassMemberDeclarations {
    readonly properties: ClassPropertyDeclaration[];
    readonly methods: ClassMethodDeclaration[];
}

/**
 * `ClassPropertyDeclaration` represents a property defined in a class
 * either directly (for example, `foo: string`)
 * or through an accessor (for example, `get foo(): string {...}`).
 */
export interface ClassPropertyDeclaration extends Declaration {
    readonly kind: DeclarationKinds.ClassPropertyDeclaration;

    /** If `true`, the property is static */
    readonly isStatic: boolean;

    /** Property type (for example, `string`) */
    readonly type: string;
}

/**
 * `ClassMethodDeclaration` represents a method defined in a class
 * (for example, `foo(): string {...}`).
 */
export interface ClassMethodDeclaration extends Declaration {
    readonly kind: DeclarationKinds.ClassMethodDeclaration;

    /** If `true`, the method is static */
    readonly isStatic: boolean;

    /** Method type (for example, `() => string`) */
    readonly type: string;
}

/**
 * `InterfaceDeclaration` represents an interface declaration
 * (for example, `interface MyInterface {...}`).
 */
export interface InterfaceDeclaration extends Declaration {
    readonly kind: DeclarationKinds.InterfaceDeclaration;

    /** Interface members */
    readonly members: InterfaceMemberDeclarations;
}

/**
 * `InterfaceMemberDeclarations` contains the members of an interface.
 */
export interface InterfaceMemberDeclarations {
    readonly properties: InterfacePropertyDeclaration[];
    readonly methods: InterfaceMethodDeclaration[];
    readonly constructSignatures: InterfaceConstructSignatureDeclaration[];
    readonly callSignatures: InterfaceCallSignatureDeclaration[];
    readonly indexSignatures: InterfaceIndexSignatureDeclaration[];
}

/**
 * `InterfacePropertyDeclaration` represents a property defined in an interface
 * (for example, `foo: string` in `interface MyInterface { foo: string }`).
 */
export interface InterfacePropertyDeclaration extends Declaration {
    readonly kind: DeclarationKinds.InterfacePropertyDeclaration;

    /** If `true`, the property is `readonly` */
    readonly isReadonly: boolean;

    /** If `true`, the property is optional */
    readonly isOptional: boolean;

    /** Property type (for example, `string`) */
    readonly type: string;
}

/**
 * `InterfaceMethodDeclaration` represents a method defined in an interface
 * (for example, `foo(): string` in `interface MyInterface { foo(): string }`).
 */
export interface InterfaceMethodDeclaration extends Declaration {
    readonly kind: DeclarationKinds.InterfaceMethodDeclaration;

    /** Method signature type (for example, `() => string`) */
    readonly type: string;
}

/**
 * `InterfaceConstructSignatureDeclaration` represents a construct signature
 * defined in an interface (for example, `new (foo: string)`).
 */
export interface InterfaceConstructSignatureDeclaration extends Declaration {
    readonly kind: DeclarationKinds.InterfaceConstructSignatureDeclaration;
}

/**
 * `InterfaceCallSignatureDeclaration` represents a call signature
 * defined in an interface (for example, `(foo: string): boolean`).
 */
export interface InterfaceCallSignatureDeclaration extends Declaration {
    readonly kind: DeclarationKinds.InterfaceCallSignatureDeclaration;
}

/**
 * `InterfaceIndexSignatureDeclaration` represents an index signature
 * defined in an interface (for example, `[index: number]: string`).
 */
export interface InterfaceIndexSignatureDeclaration extends Declaration {
    readonly kind: DeclarationKinds.InterfaceIndexSignatureDeclaration;
}

/**
 * `EnumDeclaration` represents an enum declaration
 * (for example, `enum MyEnum {...}`).
 */
export interface EnumDeclaration extends Declaration {
    readonly kind: DeclarationKinds.EnumDeclaration;

    /** If `true`, the enum is a constant enum. */
    readonly isConst: boolean;

    /** Enum members */
    readonly members: EnumMemberDeclaration[];
}

/**
 * `EnumMemberDeclaration` represents a member defined in an enum
 * (for example, `UP` in `enum MyEnum { UP, DOWN }`).
 */
export interface EnumMemberDeclaration extends Declaration {
    readonly kind: DeclarationKinds.EnumMemberDeclaration;

    /** Member's constant value */
    readonly value?: string | number;
}

/**
 * `TypeAliasDeclaration` represents a type alias declaration
 * (for example, `type myType = ...`).
 */
export interface TypeAliasDeclaration extends Declaration {
    readonly kind: DeclarationKinds.TypeAliasDeclaration;
}

/**
 * `NamespaceDeclaration` represents a namespace declaration
 * (for example, `namespace MyNamespace {...}`).
 */
export interface NamespaceDeclaration extends Declaration {
    readonly kind: DeclarationKinds.NamespaceDeclaration;

    /** Exported namespace declarations */
    readonly declarations: ModuleDeclarations;
}

/**
 * `Declaration` contains the properties common to all declaration kinds.
 */
export interface Declaration {
    /** Declaration kind */
    readonly kind: DeclarationKinds;

    /** Declaration ID */
    readonly id: string;

    /** Export name */
    readonly name: string;

    /** Documentation comments describing the declaration */
    readonly docs: string[];

    /** Location in the source code */
    readonly source: DeclarationSource;

    /** Declaration's signature */
    readonly signature: string;
}

/**
 * `DeclarationKinds` lists the possible kinds of declarations
 */
export enum DeclarationKinds {
    VariableDeclaration = 'VariableDeclaration',
    FunctionDeclaration = 'FunctionDeclaration',
    ClassDeclaration = 'ClassDeclaration',
    ClassConstructorDeclaration = 'ClassConstructorDeclaration',
    ClassPropertyDeclaration = 'ClassPropertyDeclaration',
    ClassMethodDeclaration = 'ClassMethodDeclaration',
    InterfaceDeclaration = 'InterfaceDeclaration',
    InterfacePropertyDeclaration = 'InterfacePropertyDeclaration',
    InterfaceMethodDeclaration = 'InterfaceMethodDeclaration',
    InterfaceConstructSignatureDeclaration = 'InterfaceConstructSignatureDeclaration',
    InterfaceCallSignatureDeclaration = 'InterfaceCallSignatureDeclaration',
    InterfaceIndexSignatureDeclaration = 'InterfaceIndexSignatureDeclaration',
    EnumDeclaration = 'EnumDeclaration',
    EnumMemberDeclaration = 'EnumMemberDeclaration',
    TypeAliasDeclaration = 'TypeAliasDeclaration',
    NamespaceDeclaration = 'NamespaceDeclaration',
}

/**
 * `DeclarationSource` represents the location of a declaration in a source file.
 */
export interface DeclarationSource {
    /** Filename */
    readonly filename: string;

    /** Starting line number */
    readonly line: number;

    /** URL in a remote repository linking to to the declaration */
    readonly url?: string;
}
