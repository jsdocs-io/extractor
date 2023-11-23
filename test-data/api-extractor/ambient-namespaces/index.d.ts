/** Ambient namespace Foo */
declare namespace Foo {
  /** Interface Bar */
  export interface Bar {
    /** Property qux */
    readonly qux: string;
  }

  /** Variable baz */
  const baz: boolean;
}

/** Global variable foo */
declare var foo: Foo.Bar;

/** Global read-only variable bar */
declare const bar: Foo.Bar;

/** Global function foobar */
declare function foobar(a: number, b: number): number;
