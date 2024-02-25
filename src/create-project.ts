import { Result, err, ok } from "neverthrow";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
  SourceFile,
} from "ts-morph";
import { ProjectError } from "./errors";

export type CreateProjectOptions = {
  indexFilePath: string;
  cwd: string;
};

export type ProjectContainer = {
  project: Project;
  indexFile: SourceFile;
};

export const createProject = ({
  indexFilePath,
  cwd,
}: CreateProjectOptions): Result<ProjectContainer, ProjectError> => {
  let startDir;
  try {
    // By default, ts-morph creates the project in the current working directory.
    // We must change it to the temporary directory where the packages are installed,
    // otherwise TypeScript will pick up type definitions from our local `node_modules`.
    startDir = process.cwd();
    process.chdir(cwd);
    const project = new Project({
      compilerOptions: {
        // See https://github.com/dsherret/ts-morph/issues/938
        // and https://github.com/microsoft/TypeScript/blob/master/lib/lib.esnext.full.d.ts
        lib: ["lib.esnext.full.d.ts"],
        target: ScriptTarget.ESNext,
        module: ModuleKind.ESNext,
        moduleResolution: ModuleResolutionKind.Bundler,
      },
    });
    const indexFile = project.addSourceFileAtPath(indexFilePath);
    project.resolveSourceFileDependencies();
    return ok({
      project,
      indexFile,
    });
  } catch (e) {
    return err(new ProjectError("failed to create project", { cause: e }));
  } finally {
    try {
      if (startDir) {
        process.chdir(startDir);
      }
    } catch {}
  }
};
