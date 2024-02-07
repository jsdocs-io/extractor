import { ResultAsync, ok, okAsync } from "neverthrow";
import { join } from "pathe";
import { createProject } from "./create-project";
import type { ExtractorError } from "./errors";
import type { ExtractedDeclaration } from "./extract-declarations";
import { installPackage } from "./install-package";
import { packageDeclarations } from "./package-declarations";
import { packageJson } from "./package-json";
import { packageName } from "./package-name";
import { packageOverview } from "./package-overview";
import { packageTypes } from "./package-types";
import { changeDir, currentDir } from "./process";
import { tempDir } from "./temp-dir";

export type ExtractPackageApiOptions = {
  pkg: string;
  pkgSubpath?: string;
  maxDepth?: number;
};

/**
PackageApi` contains all the information extracted from a package.
*/
export type PackageApi = {
  /** Package name (e.g., `foo`). */
  name: string;

  /** Package version number (e.g., `1.0.0`). */
  version: string;

  /**
  Package subpath selected when extracting the API (e.g., `.`, `custom`).
  @see {@link https://nodejs.org/api/packages.html#subpath-exports | Node.js docs}
  */
  subpath: string;

  /**
  Type declarations file, resolved from the selected subpath,
  that acts as the entrypoint for the package (e.g., `index.d.ts`).
  */
  types: string;

  /**
  Package description extracted from the `types` file if a
  JSDoc comment with the `@packageDocumentation` tag is found.
  */
  overview: string | undefined;

  /** Declarations exported (or re-exported) by the package. */
  declarations: ExtractedDeclaration[];

  /**
  All packages resolved and installed when installing the package (included).
  @example
  ```ts
  ["foo@1.0.0", "bar@2.0.0", "baz@3.0.0"]
  ```
  */
  packages: string[];
};

export const extractPackageApi = ({
  pkg,
  pkgSubpath = ".",
  maxDepth = 5,
}: ExtractPackageApiOptions): ResultAsync<PackageApi, ExtractorError> =>
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
    .andThen((ctx) =>
      changeDir(ctx.startDir).map(() => ({
        ...ctx,
      })),
    )
    .andThen((ctx) =>
      ok({
        name: ctx.pkgJson.name,
        version: ctx.pkgJson.version,
        subpath: ctx.pkgSubpath,
        types: ctx.pkgTypes,
        overview: ctx.pkgOverview,
        declarations: ctx.pkgDeclarations,
        packages: ctx.installedPackages,
      }),
    );
