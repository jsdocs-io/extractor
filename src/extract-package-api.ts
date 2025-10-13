import { Effect } from "effect";
import { performance } from "node:perf_hooks";
import { join } from "pathe";
import { bunPackageManager } from "./bun-package-manager.ts";
import { createProject } from "./create-project.ts";
import { packageDeclarations } from "./package-declarations.ts";
import { packageJson } from "./package-json.ts";
import { PackageManager } from "./package-manager.ts";
import { packageOverview } from "./package-overview.ts";
import { packageTypes } from "./package-types.ts";
import type {
	ExtractPackageApiEffectOptions,
	ExtractPackageApiOptions,
	PackageApi,
} from "./types.ts";
import { workDir } from "./work-dir.ts";

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
export async function extractPackageApi(opts: ExtractPackageApiOptions): Promise<PackageApi> {
	const bunPath = opts.bunPath?.trim() || "bun";
	return await extractPackageApiEffect(opts).pipe(
		Effect.scoped,
		Effect.provideService(PackageManager, bunPackageManager(bunPath)),
		Effect.runPromise,
	);
}

/** `extractPackageApiEffect` returns the Effect for extracting the API from a package. */
export function extractPackageApiEffect(opts: ExtractPackageApiEffectOptions) {
	return Effect.gen(function* () {
		// Start performance timer.
		const startTime = performance.now();

		// Parse opts.
		const pkg = opts.pkg.trim();
		const subpath = opts.subpath?.trim() || ".";
		const maxDepth = Math.max(1, Math.round(opts.maxDepth ?? 5));

		// Create a temporary directory.
		const { path: cwd } = yield* workDir;

		// Install the package and its direct and third-party dependencies.
		const pm = yield* PackageManager;
		const packages = yield* pm.installPackage({ pkg, cwd });

		// Get the package name from the only dependency listed in
		// the `package.json` created by the package manager on install.
		// The package name is read this way since the `pkg` option can
		// contain anything accepted by the package manager's `add` command
		// (e.g., URLs) and not necessarily only real package names.
		const workDirPkgJson = yield* packageJson(cwd);
		const pkgName = Object.keys(workDirPkgJson.dependencies!)[0]!;

		// Read the package's own `package.json`.
		const pkgDir = join(cwd, "node_modules", pkgName);
		const pkgJson = yield* packageJson(pkgDir);

		// Find the package's entry point.
		const types = yield* packageTypes(pkgJson, subpath);
		const indexFilePath = join(pkgDir, types);

		// Create a `ts-morph` project and get the module for the index file.
		const { project, indexFile } = yield* createProject({ indexFilePath, cwd });

		// Read the package's overview comment from the index file.
		const overview = packageOverview(indexFile);

		// Extract the declarations exported by the package.
		const declarations = yield* packageDeclarations({
			pkgName,
			project,
			indexFile,
			maxDepth,
		});

		// Return the API information extracted from the package.
		const pkgApi: PackageApi = {
			name: pkgJson.name,
			version: pkgJson.version,
			subpath,
			types,
			overview,
			declarations,
			packages,
			analyzedAt: new Date().toISOString(),
			analyzedIn: Math.round(performance.now() - startTime),
		};
		return pkgApi;
	});
}
