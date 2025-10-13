import { Effect } from "effect";
import { ModuleKind, ModuleResolutionKind, Project, ScriptTarget } from "ts-morph";
import { ProjectError } from "./errors.ts";
import type { CreateProjectOptions, CreateProjectReturn } from "./types.ts";

export function createProject({ indexFilePath, cwd }: CreateProjectOptions) {
	return Effect.try({
		try: (): CreateProjectReturn => {
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
					typeRoots: [cwd],
				},
			});

			// Add index file and resolve module imports.
			const indexFile = project.addSourceFileAtPath(indexFilePath);
			project.resolveSourceFileDependencies();

			return { project, indexFile };
		},
		catch: (err) => new ProjectError({ cause: err }),
	});
}
