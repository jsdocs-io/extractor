/** Module 'foo' */
declare module 'foo';

/** Module 'bar' */
declare module 'bar' {
    /** Variable var1 */
    const var1: string;

    /** Variable var2 */
    export const var2: boolean;
}

/** Module 'foo bar' */
declare module 'foo bar' {
    export default function sum(a: number, b: number): number;
}
