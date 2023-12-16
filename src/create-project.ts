import { Result, err, ok } from "neverthrow";
import { Project } from "ts-morph";

export const createProject = (
  indexFilePath: string,
): Result<Project, Error> => {
  try {
    const project = new Project({
      compilerOptions: {
        // See https://github.com/dsherret/ts-morph/issues/938
        // and https://github.com/microsoft/TypeScript/blob/master/lib/lib.esnext.full.d.ts
        lib: ["lib.esnext.full.d.ts"],
      },
    });
    project.addSourceFileAtPath(indexFilePath);
    project.resolveSourceFileDependencies();
    return ok(project);
  } catch (error) {
    return err(new Error(`createProject: failed to create project: ${error}`));
  }
};
