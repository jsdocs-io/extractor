import { ResultAsync, okAsync } from "neverthrow";
import { join } from "pathe";
import { createProject } from "./create-project";
import {
  errChangeDirFailed,
  errCreateProjectFailed,
  errCurrentDirFailed,
  errInstallPackageFailed,
  errInvalidPackageName,
  errReadPackageJsonFailed,
  errResolveTypesFailed,
  errTemporaryDirFailed,
  type ExtractorError,
} from "./errors";
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
      packageName(ctx.pkg)
        .map((pkgName) => ({ pkgName, ...ctx }))
        .mapErr(errInvalidPackageName),
    )
    .andThen((ctx) =>
      currentDir()
        .map((startDir) => ({ startDir, ...ctx }))
        .mapErr(errCurrentDirFailed),
    )
    .andThen((ctx) =>
      tempDir()
        .map((projectDir) => ({
          projectDir,
          pkgDir: join(projectDir, "node_modules", ctx.pkgName),
          ...ctx,
        }))
        .mapErr(errTemporaryDirFailed),
    )
    .andThen((ctx) =>
      changeDir(ctx.projectDir)
        .map(() => ctx)
        .mapErr(errChangeDirFailed),
    )
    .andThen((ctx) =>
      installPackage(ctx.pkg)
        .map(() => ctx)
        .mapErr(errInstallPackageFailed),
    )
    .andThen((ctx) =>
      readPackageJson(ctx.pkgDir)
        .map((pkgJson) => ({ pkgJson, ...ctx }))
        .mapErr(errReadPackageJsonFailed),
    )
    .andThen((ctx) =>
      resolveTypes(ctx.pkgJson, ctx.pkgSubpath)
        .map((entryPoint) => ({ entryPoint, ...ctx }))
        .mapErr(errResolveTypesFailed),
    )
    .andThen((ctx) =>
      createProject(join(ctx.pkgDir, ctx.entryPoint))
        .map((project) => ({
          project,
          ...ctx,
        }))
        .mapErr(errCreateProjectFailed),
    )
    .andThen((ctx) => {
      // Debug
      const sfs = ctx.project
        .getSourceFiles()
        .map((sf) =>
          sf.getFilePath().replace(`${ctx.projectDir}/node_modules/`, ""),
        );
      console.log(ctx.entryPoint);
      console.log(JSON.stringify(sfs, null, 2));
      return okAsync(ctx);
    })
    .andThen((ctx) =>
      changeDir(ctx.startDir)
        .map(() => ctx)
        .mapErr(errChangeDirFailed),
    );
};

// await extractApiFromPackage("query-registry");
// await extractApiFromPackage("preact", "hooks");
// await extractApiFromPackage("exome");
// await extractApiFromPackage("exome", "vue");
// await extractApiFromPackage("highlight-words");
// await extractApiFromPackage("short-time-ago");
// await extractApiFromPackage("short-time-ago", "foo"); // Expected Error
