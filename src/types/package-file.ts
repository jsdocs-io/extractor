/**
 * `PackageFile` represents a file belonging to a package.
 */
export interface PackageFile {
    /** Filename */
    readonly filename: string;

    /** If `true`, this file is the entry point to the package */
    readonly isIndexFile?: boolean;

    /** URL in a remote repository linking to the file */
    readonly url?: string;
}
