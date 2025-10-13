import { Context, Effect } from "effect";
import type { InstallPackageError } from "./errors.ts";
import type { InstallPackageOptions } from "./types.ts";

/**
`PackageManager` is an Effect service that represent a package manager
(e.g., bun) that can install a package and its dependencies returning
the list of all installed packages.
*/
export class PackageManager extends Context.Tag("PackageManager")<
	PackageManager,
	{
		readonly installPackage: (
			opts: InstallPackageOptions,
		) => Effect.Effect<string[], InstallPackageError>;
	}
>() {}
