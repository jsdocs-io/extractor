import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget, type SourceFile } from "ts-morph";

/** `GetProjectOptions` contains the options for calling {@link getProject}. */
export interface GetProjectOptions {
	/** Path to the types entry point file. */
	indexFilePath: string;

	/**
	Directory where the `@types` packages are installed.

  @see {@link https://www.typescriptlang.org/tsconfig/#typeRoots}
	*/
	typeRoots: string;
}

/** `GetProjectReturn` contains the data returned by {@link getProject}. */
export interface GetProjectReturn {
	/** `Project` created with `ts-morph`. */
	project: Project;

	/** `SourceFile` created with `ts-morph` representing the index file. */
	indexFile: SourceFile;
}

/** `getProject` returns a `ts-morph` TypeScript compiler project. */
export function getProject({ indexFilePath, typeRoots }: GetProjectOptions): GetProjectReturn {
	const project = new Project({
		compilerOptions: {
			// Include esnext types.
			// See https://github.com/dsherret/ts-morph/issues/938
			// and https://github.com/microsoft/TypeScript/blob/master/lib/lib.esnext.full.d.ts
			lib: ["lib.esnext.full.d.ts"],

			// Set modern target and module resolutions options.
			target: ScriptTarget.ESNext,
			module: ModuleKind.ESNext,
			moduleResolution: ModuleResolutionKind.Bundler,

			// By default, `ts-morph` creates a project rooted in the current working directory
			// (that is, where this library or an app using it is running).
			// We must change the `typeRoots` directory to the temporary directory where
			// the analyzed package is installed, otherwise TypeScript will discover
			// `@types` packages from our local `node_modules` directory giving
			// inconsistent analysis results due to available type definitions.
			// See https://www.typescriptlang.org/tsconfig#typeRoots.
			typeRoots: [typeRoots],
		},
	});

	// Add index file and resolve module imports.
	const indexFile = project.addSourceFileAtPath(indexFilePath);
	project.resolveSourceFileDependencies();

	return { project, indexFile };
}
