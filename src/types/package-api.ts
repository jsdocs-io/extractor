import type { ModuleDeclarations } from "./module-declarations";
import type { PackageFile } from "./package-file";

/**
 * `PackageAPI` represents the public API exported by a package.
 *
 * @see {@link PackageDeclarations}
 * @see {@link PackageFile}
 */
export interface PackageAPI {
  /** Main documentation comment describing the package */
  readonly overview?: string;

  /** Exported package declarations */
  readonly declarations: ModuleDeclarations;

  /** Files containing the exported package declarations */
  readonly files: PackageFile[];
}
