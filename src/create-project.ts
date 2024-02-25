import { Result, err, ok } from "neverthrow";
import process from "node:process";
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
  try {
    // By default, ts-morph creates the project in the current working directory.
    // We must change it to the temporary directory where the packages are installed,
    // otherwise TypeScript will pick up type definitions from our local `node_modules`.
    const startDir = process.cwd();
    process.chdir(cwd);
    const res = _createProject(indexFilePath);
    process.chdir(startDir);
    return res;
  } catch (e) {
    return err(new ProjectError("failed to change directories", { cause: e }));
  }
};

const _createProject = (
  indexFilePath: string,
): Result<ProjectContainer, ProjectError> => {
  try {
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
  }
};
