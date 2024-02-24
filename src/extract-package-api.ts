import { ResultAsync, ok, okAsync } from "neverthrow";
import { performance } from "node:perf_hooks";
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
import { removeDir } from "./remove-dir";
import { tempDir } from "./temp-dir";

/**
`ExtractPackageApiOptions` contains all the options
for calling {@link extractPackageApi}.
*/
export type ExtractPackageApiOptions = {
  /**
  Package to extract the API from.

  This can be either a package name (e.g., `foo`) or any other query
  that can be passed to `bun add` (e.g., `foo@1.0.0`).

  @see {@link https://bun.sh/docs/cli/add | Bun docs}
  */
  pkg: string;

  /**
  Specific subpath to consider in a package.

  If a package has multiple entrypoints listed in the `exports` property
  of its `package.json`, use `subpath` to select a specific one by its name
  (e.g., `someFeature`).

  @defaultValue `.` (package root)

  @see {@link https://nodejs.org/api/packages.html#subpath-exports | Node.js docs}
  @see {@link https://github.com/lukeed/resolve.exports | resolve.exports docs}
  */
  subpath?: string;

  /**
  Packages can have deeply nested modules and namespaces.

  Use `maxDepth` to limit the depth of the extraction.
  Declarations nested at levels deeper than this value will be ignored.

  @defaultValue 5
  */
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
  Package subpath selected when extracting the API (e.g., `.`, `someFeature`).

  @see {@link ExtractPackageApiOptions.subpath}
  @see {@link https://nodejs.org/api/packages.html#subpath-exports | Node.js docs}
  */
  subpath: string;

  /**
  Type declarations file, resolved from the selected `subpath`,
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

  /** Timestamp of when the package was analyzed. */
  analyzedAt: string;

  /** Package analysis duration in milliseconds. */
  analyzedIn: number;
};

/**
`extractPackageApi` extracts the API from a package.

`extractPackageApi` returns a {@link https://github.com/supermacro/neverthrow?tab=readme-ov-file#asynchronous-api-resultasync | `ResultAsync`}
which can be `await`ed to get a {@link https://github.com/supermacro/neverthrow?tab=readme-ov-file#synchronous-api-result | `Result`}.
If the extraction succeeds, the `Result` will be `Ok` and contain the data described in {@link PackageApi}.
Otherwise, the `Result` will be `Err` and contain an {@link ExtractorError}.

Warning: The extraction process is slow and blocks the main thread, using workers is recommended.

@example
```ts
const result = await extractPackageApi({
  pkg: "foo",   // Extract API from package `foo` [Required]
  subpath: ".", // Select subpath `.` (root subpath) [Optional]
  maxDepth: 5,  // Maximum depth for analyzing nested namespaces [Optional]
});

if (result.isOk()) {
  const packageApi = result.value; // Successfully extracted API
  console.log(JSON.stringify(packageApi, null, 2));
} else {
  const extractorError = result.error; // Error extracting API
  console.error(extractorError);
}
```

@param options - {@link ExtractPackageApiOptions}

@see {@link https://github.com/supermacro/neverthrow/wiki/Accessing-The-Value-Inside-A-Result | Accessing the value inside a Result}
@see {@link https://github.com/supermacro/neverthrow/wiki/Basic-Usage-Examples#asynchronous-api | Result and ResultAsync usage}
*/
export const extractPackageApi = ({
  pkg,
  subpath = ".",
  maxDepth = 5,
}: ExtractPackageApiOptions): ResultAsync<PackageApi, ExtractorError> =>
  okAsync({
    pkg,
    pkgSubpath: subpath,
    maxDepth,
    startTime: performance.now(),
  })
    .andThen((ctx) =>
      packageName(ctx.pkg).map((pkgName) => ({
        ...ctx,
        pkgName,
      })),
    )
    .andThen((ctx) =>
      tempDir().map((workDir) => ({
        ...ctx,
        workDir,
      })),
    )
    .andThen((ctx) =>
      installPackage(ctx.pkg, ctx.workDir).map((installedPackages) => ({
        ...ctx,
        pkgDir: join(ctx.workDir, "node_modules", ctx.pkgName),
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
      createProject(ctx.typesFilePath, ctx.workDir).map(
        ({ project, indexFile }) => ({
          ...ctx,
          project,
          indexFile,
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
      removeDir(ctx.workDir)
        .map(() => ctx)
        .orElse(() => ok(ctx)),
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
        analyzedAt: new Date().toISOString(),
        analyzedIn: Math.round(performance.now() - ctx.startTime),
      }),
    );
