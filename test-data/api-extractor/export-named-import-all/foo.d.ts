/**
 * Foo module
 */

/** Variable bar1 */
export const bar1: string;

/** Function bar2 */
export function bar2(a: number, b: number): number;

/** Interface Bar3 */
export interface Bar3<T> {
    readonly baz: <U>(t: T, u: U) => boolean;
}
