import { ResultAsync, ok, okAsync } from "neverthrow";
import { join } from "pathe";
import { createProject } from "./create-project";
import type { ExtractorError } from "./errors";
import { installPackage } from "./install-package";
import { packageJson } from "./package-json";
import { packageName } from "./package-name";
import { packageOverview } from "./package-overview";
import { packageTypes } from "./package-types";
import { changeDir, currentDir } from "./process";
import { tempDir } from "./temp-dir";

export const extractApiFromPackage = (
  pkg: string,
  pkgSubpath = ".",
): ResultAsync<unknown, ExtractorError> => {
  return okAsync({ pkg, pkgSubpath })
    .andThen((ctx) =>
      packageName(ctx.pkg).map((pkgName) => ({
        ...ctx,
        pkgName,
      })),
    )
    .andThen((ctx) =>
      currentDir().map((startDir) => ({
        ...ctx,
        startDir,
      })),
    )
    .andThen((ctx) =>
      tempDir().map((rootDir) => ({
        ...ctx,
        rootDir,
      })),
    )
    .andThen((ctx) =>
      changeDir(ctx.rootDir).map(() => ({
        ...ctx,
      })),
    )
    .andThen((ctx) =>
      installPackage(ctx.pkg).map(() => ({
        ...ctx,
        nodeModulesDir: join(ctx.rootDir, "node_modules"),
        pkgDir: join(ctx.rootDir, "node_modules", ctx.pkgName),
      })),
    )
    .andThen((ctx) =>
      packageJson(ctx.pkgDir).map((pkgJson) => ({
        ...ctx,
        pkgJson,
      })),
    )
    .andThen((ctx) =>
      packageTypes(ctx.pkgJson, ctx.pkgSubpath).map((pkgTypes) => ({
        ...ctx,
        pkgTypes,
        typesFilePath: join(ctx.pkgDir, pkgTypes),
      })),
    )
    .andThen((ctx) =>
      createProject(ctx.typesFilePath).map(
        ({ project, indexFile, sourceFiles }) => ({
          ...ctx,
          project,
          indexFile,
          sourceFiles,
        }),
      ),
    )
    .andThen((ctx) =>
      ok(packageOverview(ctx.indexFile)).map((pkgOverview) => ({
        ...ctx,
        pkgOverview,
      })),
    )
    .andThen((ctx) => {
      // Debug
      const sourceFiles = ctx.sourceFiles
        .map((sf) => sf.getFilePath().replace(ctx.nodeModulesDir, ""))
        .sort();
      const indexFile = ctx.indexFile;
      const referencedFiles = indexFile
        .getReferencedSourceFiles()
        .map((sf) => sf.getFilePath().replace(ctx.nodeModulesDir, ""))
        .sort();
      console.log(
        JSON.stringify(
          {
            indexFile: indexFile.getFilePath().replace(ctx.nodeModulesDir, ""),
            sourceFiles,
            referencedFiles,
            pkgOverview: ctx.pkgOverview,
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
    .andThen((ctx) =>
      changeDir(ctx.startDir).map(() => ({
        ...ctx,
      })),
    );
};

// await extractApiFromPackage("query-registry");
// await extractApiFromPackage("preact", "hooks");
// await extractApiFromPackage("exome");
// await extractApiFromPackage("exome", "vue");
// await extractApiFromPackage("highlight-words");
// await extractApiFromPackage("short-time-ago");
// await extractApiFromPackage("short-time-ago", "foo"); // Expected Error
