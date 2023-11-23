import * as tsm from "ts-morph";

export function getProject({
  fileSystem,
  pattern = "**/*.ts",
}: {
  fileSystem: tsm.FileSystemHost;
  pattern?: string;
}): tsm.Project {
  const project = new tsm.Project({
    fileSystem,
    compilerOptions: {
      // See https://github.com/dsherret/ts-morph/issues/938
      // and https://github.com/microsoft/TypeScript/blob/master/lib/lib.esnext.full.d.ts
      lib: ["lib.esnext.full.d.ts"],
    },
  });

  project.addSourceFilesAtPaths(pattern);

  return project;
}
