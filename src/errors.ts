import { Data } from "effect";

/** `InstallPackageError` occurs when the package manager fails to install a package. */
export class InstallPackageError extends Data.TaggedError("InstallPackageError")<{
	cause?: unknown;
}> {}

/** `WorkDirError` occurs when a temporary work directory cannot be created. */
export class WorkDirError extends Data.TaggedError("WorkDirError")<{ cause?: unknown }> {}

/** `PackageJsonError` occurs when a `package.json` file cannot be read. */
export class PackageJsonError extends Data.TaggedError("PackageJsonError")<{ cause?: unknown }> {}
