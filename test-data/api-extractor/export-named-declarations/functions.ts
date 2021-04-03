/**
 * Func1 returns the sum of two numbers.
 * @param a - the first number
 * @param b - the second number
 */
export function func1(a: number, b: number): number {
    return a + b;
}

/**
 * Func2 returns the sum of two numbers.
 * @param a - the first number
 * @param b - the second number
 */
export const func2 = ({ a, b }: { a: number; b: number }): number => a + b;

/**
 * Func3 returns the sum of two numbers.
 * @param a - the first number
 * @param b - the second number
 */
export const func3 = function ({ a, b }: { a: number; b: number }) {
    return a + b;
};

/**
 * Func4 is overloaded and returns its input.
 */
function func4(a: number): number;
function func4(a: string): string;
function func4(a: any): any {
    return a;
}

export { func4 };

export async function func5(): Promise<void> {}

/** @internal */
export function func6(): void {}

/** @internal */
export const func7 = () => {};

export let func8: (a: string) => number;
