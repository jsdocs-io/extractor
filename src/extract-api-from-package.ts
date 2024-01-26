import { ResultAsync, ok, okAsync } from "neverthrow";
import { join } from "pathe";
import { createProject } from "./create-project";
import type { ExtractorError } from "./errors";
import { installPackage } from "./install-package";
import { packageDeclarations } from "./package-declarations";
import { packageJson } from "./package-json";
import { packageName } from "./package-name";
import { packageOverview } from "./package-overview";
import { packageTypes } from "./package-types";
import { changeDir, currentDir } from "./process";
import { tempDir } from "./temp-dir";

export type ExtractApiFromPackageOptions = {
  pkg: string;
  pkgSubpath?: string;
  maxDepth?: number;
};

export const extractApiFromPackage = ({
  pkg,
  pkgSubpath = ".",
  maxDepth = 5,
}: ExtractApiFromPackageOptions): ResultAsync<unknown, ExtractorError> =>
  okAsync({ pkg, pkgSubpath, maxDepth })
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
      installPackage(ctx.pkg).map((installedPackages) => ({
        ...ctx,
        nodeModulesDir: join(ctx.rootDir, "node_modules"),
        pkgDir: join(ctx.rootDir, "node_modules", ctx.pkgName),
        installedPackages,
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
    .andThen((ctx) =>
      packageDeclarations({
        pkgName: ctx.pkgName,
        project: ctx.project,
        indexFile: ctx.indexFile,
        maxDepth: ctx.maxDepth,
      }).map((pkgDeclarations) => ({
        ...ctx,
        pkgDeclarations,
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
            installedPackages: ctx.installedPackages,
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

// await extractApiFromPackage({ pkg: "query-registry" });
// await extractApiFromPackage({ pkg: "preact", pkgSubpath: "hooks" });
// await extractApiFromPackage({ pkg: "exome", pkgSubpath: "vue" });
// await extractApiFromPackage({ pkg: "highlight-words" });
// await extractApiFromPackage({ pkg: "short-time-ago" });
// await extractApiFromPackage({ pkg: "short-time-ago", pkgSubpath: "foo" }); // Expected Error
