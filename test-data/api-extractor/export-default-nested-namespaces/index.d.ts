/**
 * This is similar to the structure of `index.d.ts` for `firebase@8.2.2`.
 *
 * @packageDocumentation
 */

/** foo doc */
declare namespace foo {
    /** fooFunc doc */
    function fooFunc(s: string): string;
}

/** foo.bar doc */
declare namespace foo.bar {
    /** foobarFunc doc */
    function foobarFunc(n: number): number;
}

/** foo.bar.baz doc */
declare namespace foo.bar.baz {
    /** foobarbazFunc doc */
    function foobarbazFunc(b: boolean): boolean;
}

// Namespace `abc` is at depth 6 and should not be extracted
declare namespace foo.bar.baz.qux.xyz.abc {}

export default foo;
