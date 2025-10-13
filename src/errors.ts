import { Data } from "effect";

/** `InstallPackageError` occurs when the package manager fails to install a package. */
export class InstallPackageError extends Data.TaggedError("InstallPackageError")<{
	cause?: unknown;
}> {}

/** `WorkDirError` occurs when a temporary work directory cannot be created. */
export class WorkDirError extends Data.TaggedError("WorkDirError")<{ cause?: unknown }> {}

/** `PackageJsonError` occurs when a `package.json` file cannot be read. */
export class PackageJsonError extends Data.TaggedError("PackageJsonError")<{ cause?: unknown }> {}

/** `PackageTypesError` occurs when the types entry point file for a package cannot be resolved. */
export class PackageTypesError extends Data.TaggedError("PackageTypesError") {}

/** `ProjectError` occurs when the `ts-morph` project cannot be created. */
export class ProjectError extends Data.TaggedError("ProjectError")<{ readonly cause?: unknown }> {}
