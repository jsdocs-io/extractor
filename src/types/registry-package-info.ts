import { PackageManifest } from "query-registry";
import { PackageAPI } from "./package-api";

/**
 * `RegistryPackageInfo` contains the data extracted from a package
 * hosted on an npm-like registry.
 *
 * @see {@link PackageAPI}
 * @see {@link query-registry#PackageManifest}
 */
export interface RegistryPackageInfo {
  /** Package version ID (for example, `foo@1.0.0` or `@bar/baz@1.0.0`) */
  readonly id: string;

  /** Package manifest from the registry */
  readonly manifest: PackageManifest;

  /** Public package API */
  readonly api?: PackageAPI;

  /** Time at which this data was created */
  readonly createdAt: string;

  /** Package analysis duration in milliseconds */
  readonly elapsed: number;
}
