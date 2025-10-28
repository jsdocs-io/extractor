import { performance } from "node:perf_hooks";
import { join } from "pathe";
import { Bun } from "./bun.ts";
import { getPackageDeclarations } from "./get-package-declarations.ts";
import { getPackageJson } from "./get-package-json.ts";
import { getPackageOverview } from "./get-package-overview.ts";
import { getPackageTypes } from "./get-package-types.ts";
import { getProject } from "./get-project.ts";
import { tempDir } from "./temp-dir.ts";
import type { ExtractedDeclaration } from "./types.ts";

/** `GetPackageApiOptions` contains the options for calling {@link getPackageApi}. */
export interface GetPackageApiOptions {
	/**
  Package to extract the API from.

  This can be either a package name (e.g., `foo`, `@foo/bar`) or
  any other query that can be passed to `bun add` (e.g., `foo@1.0.0`).

  @see {@link https://bun.sh/docs/cli/add | Bun docs}
  */
	pkg: string;

	/**
  Specific subpath to consider in a package.

  If a package has multiple entrypoints listed in the `exports` map property
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

	/**
	Bun instance used to install the package.

  @defaultValue a new `Bun` instance
  */
	bun?: Bun;
}

/** `PackageApi` contains the data extracted from a package by calling {@link getPackageApi}. */
export interface PackageApi {
	/** Package name (e.g., `foo`, `@foo/bar`). */
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
	types?: string;

	/**
  Package description extracted from the `types` file if a
  JSDoc comment with the `@packageDocumentation` tag is found.
  */
	overview?: string;

	/** Declarations exported (or re-exported) by the package. */
	declarations: ExtractedDeclaration[];

	/**
  All packages resolved and installed when installing the package (included).

  @example
  ```ts
  // Installing `foo` brings in also `bar` and `baz` as dependencies.
  ["foo@1.0.0", "bar@2.0.0", "baz@3.0.0"]
  ```
  */
	dependencies: string[];

	/** Timestamp of when the package was analyzed. */
	analyzedAt: string;

	/** Package analysis duration in milliseconds. */
	analyzedIn: number;
}

/**
`getPackageApi` extracts the API from a package.

If the extraction succeeds, `getPackageApi` returns a {@link PackageApi} object.
If the extraction fails, `getPackageApi` throws an error.

Warning: The extraction process is slow and blocks the main thread, using workers is recommended.

@example
```ts
const packageApi = await getPackageApi({
  pkg: "foo",    // Extract API from npm package `foo` [Required]
  subpath: ".",  // Select subpath `.` (root subpath) [Optional]
  maxDepth: 5,   // Maximum depth for analyzing nested namespaces [Optional]
  bun: new Bun() // Bun package manager instance [Optional]
});
console.log(JSON.stringify(packageApi, null, 2));
```

@param options - {@link GetPackageApiOptions}

@returns A {@link PackageApi} object
*/
export async function getPackageApi({
	pkg,
	subpath = ".",
	maxDepth = 5,
	bun = new Bun(),
}: GetPackageApiOptions): Promise<PackageApi> {
	// Normalize options.
	pkg = pkg.trim();
	subpath = subpath.trim() || ".";
	maxDepth = Math.max(1, Math.round(maxDepth));

	// Start performance timer.
	const start = performance.now();

	// Create a temporary directory where to install the package.
	await using dir = await tempDir();
	const cwd = dir.path;

	// Install the package and its direct and third-party dependencies.
	const dependencies = await bun.add(pkg, cwd);

	// Read the package's `package.json`.
	const pkgName = await getInstalledPackageName(cwd);
	const pkgDir = join(cwd, "node_modules", pkgName);
	const pkgJson = await getPackageJson(pkgDir);
	const { name, version } = pkgJson;

	// Find the package's types entry point file, if any.
	const types = getPackageTypes({ pkgJson, subpath });
	if (!types) {
		return {
			name,
			version,
			subpath,
			types: undefined,
			overview: undefined,
			declarations: [],
			dependencies,
			analyzedAt: analyzedAt(),
			analyzedIn: analyzedIn(start),
		};
	}

	// Create TypeScript project.
	const pkgTypes = join(pkgDir, types);
	const { project, indexFile } = getProject({ indexFilePath: pkgTypes, typeRoots: cwd });

	// Get overview.
	const overview = getPackageOverview(indexFile);

	// Extract the declarations exported by the package.
	const declarations = await getPackageDeclarations({ pkgName, project, indexFile, maxDepth });

	// Return the data extracted from the package.
	return {
		name,
		version,
		subpath,
		types,
		overview,
		declarations,
		dependencies,
		analyzedAt: analyzedAt(),
		analyzedIn: analyzedIn(start),
	};
}

async function getInstalledPackageName(cwd: string): Promise<string> {
	// Since `pkg` can contain any argument accepted by Bun's `add` command
	// (e.g., URLs), get the package name from the only dependency listed in
	// the `package.json` file created by Bun in the `cwd` on install.
	const pkgJson = await getPackageJson(cwd);
	return Object.keys(pkgJson.dependencies!).at(0)!;
}

function analyzedAt(): string {
	return new Date().toISOString();
}

function analyzedIn(start: number): number {
	return Math.round(performance.now() - start);
}
