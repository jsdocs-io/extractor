/**
 * `TaggedGitRepository` represents a remote git repository at a given commit/tag.
 *
 * @internal
 */
export interface TaggedGitRepository {
    readonly url: string;
    readonly tag?: string;
    readonly dir?: string;
}
