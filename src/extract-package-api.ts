import { Effect } from "effect";
import { bunPackageManager } from "./bun-package-manager";
import { extractPackageApiEffect } from "./extract-package-api-effect";
import { PackageManager } from "./package-manager";
import type { ExtractPackageApiOptions, PackageApi } from "./types";

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
export const extractPackageApi = async ({
	pkg,
	subpath = ".",
	maxDepth = 5,
	bunPath = "bun",
}: ExtractPackageApiOptions): Promise<PackageApi> => {
	return await extractPackageApiEffect({ pkg, subpath, maxDepth }).pipe(
		Effect.scoped,
		Effect.provideService(PackageManager, bunPackageManager(bunPath)),
		Effect.runPromise,
	);
};
