import type { ExportedDeclarations, ModuleDeclaration, Project, SourceFile } from "ts-morph";

/** `ExtractPackageApiOptions` contains the options for calling {@link extractPackageApi}. */
export interface ExtractPackageApiOptions {
	/**
  Package to extract the API from.

  This can be either a package name (e.g., `foo`, `@foo/bar`) or
  any other query that can be passed to `bun add` (e.g., `foo@1.0.0`).

  @see {@link https://bun.sh/docs/cli/add | Bun docs}
  */
	pkg: string;

	/**
  Specific subpath to consider in a package.

  If a package has multiple entrypoints listed in the `exports` property
  of its `package.json`, use `subpath` to select a specific one by its name
  (e.g., `someFeature`).

  @defaultValue `.` (package root)

  @see {@link https://nodejs.org/api/packages.html#subpath-exports | Node.js docs}
  @see {@link https://github.com/lukeed/resolve.exports | resolve.exports docs}
  */
	subpath?: string;

	/**
  Packages can have deeply nested modules and namespaces.

  Use `maxDepth` to limit the depth of the extraction.
  Declarations nested at levels deeper than this value will be ignored.

  @defaultValue 5
  */
	maxDepth?: number;

	/**
  Absolute path to the `bun` executable.

  @defaultValue `bun`
  */
	bunPath?: string;
}

/** `ExtractPackageApiEffectOptions` contains the options for calling {@link extractPackageApiEffect}. */
export type ExtractPackageApiEffectOptions = Omit<ExtractPackageApiOptions, "bunPath">;

/** `PackageApi` contains all the information extracted from a package. */
export interface PackageApi {
	/** Package name (e.g., `foo`, `@foo/bar`). */
	name: string;

	/** Package version number (e.g., `1.0.0`). */
	version: string;

	/**
  Package subpath selected when extracting the API (e.g., `.`, `someFeature`).

  @see {@link ExtractPackageApiOptions.subpath}
  @see {@link https://nodejs.org/api/packages.html#subpath-exports | Node.js docs}
  */
	subpath: string;

	/**
  Type declarations file, resolved from the selected `subpath`,
  that acts as the entrypoint for the package (e.g., `index.d.ts`).
  */
	types: string;

	/**
  Package description extracted from the `types` file if a
  JSDoc comment with the `@packageDocumentation` tag is found.
  */
	overview?: string;

	/** Declarations exported (or re-exported) by the package. */
	declarations: ExtractedDeclaration[];

	/**
  All packages resolved and installed when installing the package (included).

  @example
  ```ts
  // Installing `foo` brings in also `bar` and `baz` as dependencies.
  ["foo@1.0.0", "bar@2.0.0", "baz@3.0.0"]
  ```
  */
	packages: string[];

	/** Timestamp of when the package was analyzed. */
	analyzedAt: string;

	/** Package analysis duration in milliseconds. */
	analyzedIn: number;
}

/** `ExtractDeclarationsOptions` contains the options for calling {@link extractDeclarations}. */
export interface ExtractDeclarationsOptions {
	/** Container that exports the top-level declarations. */
	container: SourceFile | ModuleDeclaration;

	/**
  Container name (e.g., the name of a namespace), used to generate declaration IDs.
  */
	containerName: string;

	/** Maximum extraction depth for nested namespaces. */
	maxDepth: number;

	/** Instance of a `ts-morph` `Project`, used to find ambient modules. */
	project?: Project;

	/** Name of the package being analyzed, used to filter ambient modules. */
	pkgName?: string;
}

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

/** `InstallPackageOptions` contains the options for calling {@link PackageManager.installPackage}. */
export interface InstallPackageOptions {
	/** Package to install. */
	pkg: string;

	/** Directory where to install the package as a dependency. */
	cwd: string;
}

/** `WorkDir` represents a temporary directory resource. */
export interface WorkDir {
	/** Directory path. */
	path: string;

	/** Cleanup function to remove the directory. */
	close: () => Promise<void>;
}

/** `CreateProjectOptions` contains the options for calling {@link createProject}. */
export interface CreateProjectOptions {
	/** Path to the types entry point file. */
	indexFilePath: string;

	/** Directory where the analyzed package is installed. */
	cwd: string;
}

/** `CreateProjectReturn` represents the return value of {@link createProject}. */
export interface CreateProjectReturn {
	/** `Project` created with `ts-morph`. */
	project: Project;

	/** `SourceFile` created with `ts-morph` representing the index file. */
	indexFile: SourceFile;
}

/** `PackageDeclarationsOptions` contains the options for calling {@link packageDeclarations}. */
export interface PackageDeclarationsOptions {
	/** Name of the analyzed package. */
	pkgName: string;

	/** `Project` created with `ts-morph`. */
	project: Project;

	/** `SourceFile` created with `ts-morph` representing the index file. */
	indexFile: SourceFile;

	/** Depth limit for the extraction. */
	maxDepth: number;
}

/** `FoundDeclaration` represents a declaration found during the initial extraction process. */
export interface FoundDeclaration {
	/** Declaration container name. */
	containerName: string;

	/** Export name (may differ from the original name). */
	exportName: string;

	/** Declaration. */
	declaration: ExportedDeclarations;
}
