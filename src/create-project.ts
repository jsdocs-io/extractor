import { Effect } from "effect";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";

export type CreateProjectOptions = {
  indexFilePath: string;
  cwd: string;
};

/** @internal */
export class ProjectError {
  readonly _tag = "ProjectError";
  constructor(readonly cause?: unknown) {}
}

export const createProject = ({ indexFilePath, cwd }: CreateProjectOptions) =>
  Effect.try({
    try: () => {
      const project = new Project({
        compilerOptions: {
          // See https://github.com/dsherret/ts-morph/issues/938
          // and https://github.com/microsoft/TypeScript/blob/master/lib/lib.esnext.full.d.ts
          lib: ["lib.esnext.full.d.ts"],
          target: ScriptTarget.ESNext,
          module: ModuleKind.ESNext,
          moduleResolution: ModuleResolutionKind.Bundler,
          // By default, ts-morph creates a project rooted in the current working directory.
          // We must change the `typeRoots` directory to the temporary directory
          // where the packages are installed, otherwise TypeScript will discover
          // `@types` packages from our local `node_modules` directory.
          // See https://www.typescriptlang.org/tsconfig#typeRoots.
          typeRoots: [cwd],
        },
      });
      const indexFile = project.addSourceFileAtPath(indexFilePath);
      project.resolveSourceFileDependencies();
      return { project, indexFile };
    },
    catch: (e) => new ProjectError(e),
  });
