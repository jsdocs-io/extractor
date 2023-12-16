import { ResultAsync, okAsync } from "neverthrow";
import { join } from "pathe";
import { createProject } from "./create-project";
import type { ExtractorError } from "./errors";
import { installPackage } from "./install-package";
import { packageName } from "./package-name";
import { changeDir, currentDir } from "./process";
import { readPackageJson } from "./read-package-json";
import { resolveTypes } from "./resolve-types";
import { tempDir } from "./temp-dir";

export const extractApiFromPackage = (
  pkg: string,
  pkgSubpath = ".",
): ResultAsync<unknown, ExtractorError> => {
  return okAsync({ pkg, pkgSubpath })
    .andThen((ctx) =>
      packageName(ctx.pkg).map((pkgName) => ({ pkgName, ...ctx })),
    )
    .andThen((ctx) => currentDir().map((startDir) => ({ startDir, ...ctx })))
    .andThen((ctx) => tempDir().map((rootDir) => ({ rootDir, ...ctx })))
    .andThen((ctx) => changeDir(ctx.rootDir).map(() => ctx))
    .andThen((ctx) =>
      installPackage(ctx.pkg).map(() => ({
        nodeModulesDir: join(ctx.rootDir, "node_modules"),
        pkgDir: join(ctx.rootDir, "node_modules", ctx.pkgName),
        ...ctx,
      })),
    )
    .andThen((ctx) =>
      readPackageJson(ctx.pkgDir).map((pkgJson) => ({ pkgJson, ...ctx })),
    )
    .andThen((ctx) =>
      resolveTypes(ctx.pkgJson, ctx.pkgSubpath).map((pkgTypes) => ({
        pkgTypes,
        typesFilePath: join(ctx.pkgDir, pkgTypes),
        ...ctx,
      })),
    )
    .andThen((ctx) =>
      createProject(ctx.typesFilePath).map((project) => ({
        project,
        ...ctx,
      })),
    )
    .andThen((ctx) => {
      // Debug
      const sourceFiles = ctx.project
        .getSourceFiles()
        .map((sf) => sf.getFilePath().replace(ctx.nodeModulesDir, ""));
      const indexFile = ctx.project.getSourceFileOrThrow(ctx.typesFilePath);
      const referencedFiles = indexFile
        .getReferencedSourceFiles()
        .map((sf) => sf.getFilePath().replace(ctx.nodeModulesDir, ""));
      console.log(
        JSON.stringify(
          {
            indexFile: indexFile.getFilePath().replace(ctx.nodeModulesDir, ""),
            sourceFiles,
            referencedFiles,
          },
          null,
          2,
        ),
      );
      for (const [name, declarations] of indexFile.getExportedDeclarations()) {
        console.log(
          `${name}: ${declarations
            .map(
              (d) =>
                `https://unpkg.com/browse/${d
                  .getSourceFile()
                  .getFilePath()
                  .replace(ctx.nodeModulesDir, "")
                  .replace("/", "")}#L${d.getStartLineNumber()}`,
            )
            .join(", ")}`,
        );
      }
      return okAsync(ctx);
    })
    .andThen((ctx) => changeDir(ctx.startDir).map(() => ctx));
};

// await extractApiFromPackage("query-registry");
// await extractApiFromPackage("preact", "hooks");
// await extractApiFromPackage("exome");
// await extractApiFromPackage("exome", "vue");
// await extractApiFromPackage("highlight-words");
// await extractApiFromPackage("short-time-ago");
// await extractApiFromPackage("short-time-ago", "foo"); // Expected Error
