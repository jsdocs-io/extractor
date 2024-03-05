import { Effect } from "effect";
import type { ExtractedDeclaration } from "./extract-declarations";
import { extractPackageApiEffect } from "./extract-package-api-effect";

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

	/**
  Absolute path to the `bun` executable.
  Used to locate bun if it's not in `PATH`.

  @defaultValue `bun`
  */
	bunPath?: string;
};

/**
`PackageApi` contains all the information extracted from a package.
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

If the extraction succeeds, `extractPackageApi` returns a {@link PackageApi} object.
If the extraction fails, `extractPackageApi` throws an error.

Warning: The extraction process is slow and blocks the main thread, using workers is recommended.

@example
```ts
const packageApi = await extractPackageApi({
  pkg: "foo",    // Extract API from npm package `foo` [Required]
  subpath: ".",  // Select subpath `.` (root subpath) [Optional]
  maxDepth: 5,   // Maximum depth for analyzing nested namespaces [Optional]
  bunPath: "bun" // Absolute path to the `bun` executable [Optional]
});
console.log(JSON.stringify(packageApi, null, 2));
```

@param options - {@link ExtractPackageApiOptions}

@returns A {@link PackageApi} object
*/
export const extractPackageApi = ({
	pkg,
	subpath = ".",
	maxDepth = 5,
	bunPath = "bun",
}: ExtractPackageApiOptions): Promise<PackageApi> =>
	Effect.runPromise(
		extractPackageApiEffect({ pkg, subpath, maxDepth, bunPath }),
	);
