// See https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html

/**
 * This is the overview.
 *
 * @packageDocumentation
 */

/** func1 function */
declare function func1(s: string): func1.Interface1;
declare function func1(n: number): func1.Interface2;

/** func1 namespace */
declare namespace func1 {
  /** Interface1 */
  interface Interface1 {
    readonly foo: string;
  }

  /** Interface2 */
  interface Interface2 {
    readonly bar: number;
  }

  /** var1 */
  const var1: string;
}

export = func1;
