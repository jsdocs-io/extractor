import { Context, Data, Effect } from "effect";

/** @internal */
export type InstallPackageOptions = {
	pkg: string;
	cwd: string;
};

/** @internal */
export class InstallPackageError extends Data.TaggedError("InstallPackageError")<{
	cause?: unknown;
}> {}

/** @internal */
export class PackageManager extends Context.Tag("PackageManager")<
	PackageManager,
	{
		readonly installPackage: ({
			pkg,
			cwd,
		}: InstallPackageOptions) => Effect.Effect<string[], InstallPackageError>;
	}
>() {}
