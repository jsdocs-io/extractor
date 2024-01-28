import dedent from "ts-dedent";
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
} from "ts-morph";
import { expect, test } from "vitest";
import { extractDeclarations } from "../../src";

test("export named declarations", async () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      lib: ["lib.esnext.full.d.ts"],
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      moduleResolution: ModuleResolutionKind.Bundler,
    },
  });
  project.createSourceFile(
    "classes.ts",
    dedent`
    /**
     * Class001
     */
    export class Class001 {}

    export class Class002 extends Class001 {}

    export abstract class Class003 {}

    interface A {}
    interface B {}

    export class Class004 implements A, B {}

    class Class005 extends Class003 implements A, B {}
    export { Class005 };

    export class Class006<T> {}

    export class Class007<T extends object, U, V extends keyof T>
      extends Class003
      implements A, B {}

    export class Class008 {
      /** Constructor */
      constructor(foo: any, bar: any);
      constructor(foo: string, bar: number) {
        foo as unknown;
        bar as unknown;
      }
    }

    export class Class009 {
      protected constructor(foo: string, bar: number) {
        foo as unknown;
        bar as unknown;
      }
    }

    export class Class010 {
      private constructor(foo: string, bar: number) {
        foo as unknown;
        bar as unknown;
      }
    }

    export class Class011 {
      private static qux = "qux";

      /** Foo */
      static readonly foo = "foo";

      /** Bar */
      static bar(): number {
        return 0;
      }

      /** Get baz */
      static get baz() {
        return 0;
      }

      /** Set baz */
      static set baz(value: number) {
        value as unknown;
        this.qux as unknown;
      }

      /** Get bat */
      static get bat() {
        return "";
      }
    }

    export class Class012 {
      private qux = "qux";

      /** Foo */
      readonly foo = "foo";

      /** Foobar */
      public foobar?: string;

      /** Bar */
      bar(): number {
        return 0;
      }

      /** Get baz */
      get baz() {
        return 0;
      }

      /** Set baz */
      set baz(value: number) {
        value as unknown;
        this.qux as unknown;
      }

      /** Get bat */
      get bat() {
        return "";
      }
    }

    export class Class013 {
      constructor(
        /** Foo */
        readonly foo: string = "foo",
        /** Bar */
        protected readonly bar: string,
        private baz: string,
        qux: string,
        ...rest: number[]
      ) {}
    }

    export abstract class Class014 {
      /** Foo */
      abstract foo: string;

      /** Bar */
      protected abstract bar: string;

      /** Baz */
      abstract baz(): number;
    }

    /** @internal */
    export class Class015 {}

    export class Class016 {
      /** @internal */
      static foo = "foo";

      // Starts with underscore
      _quux: string;

      /** @internal */
      constructor() {
        this._quux = "quux";
        this.bar = 0;
      }

      /** @internal */
      bar: number;

      /** @internal */
      baz() {}
    }
    `,
  );
  project.createSourceFile(
    "enums.ts",
    dedent`
    /**
     * Enum1
     */
    export const enum Enum1 {
      /** Positive */
      Yes,
      No,
    }

    export enum Enum2 {
      Ok = 1,
      Ko,
    }

    enum Enum3 {
      A = "A",
      B = "B",
      C = "C",
    }

    export { Enum3 };

    export enum Enum4 {}

    /** @internal */
    export enum Enum5 {}

    export enum Enum6 {
      A,
      /** @internal */
      B,
    }
    `,
  );
  project.createSourceFile(
    "functions.ts",
    dedent`
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
    `,
  );
  project.createSourceFile(
    "interfaces.ts",
    dedent`
    /**
     * Interface001
     */
    export interface Interface001 {
      readonly x: number;
      readonly y: number;
    }

    export interface Interface002 extends Interface001 {
      z?: number;
    }

    export interface Interface003 extends Interface001, Interface002 {}

    export interface Interface004 {
      (a: string): string;
    }

    export interface Interface005 {
      readonly [index: string]: number | string;
    }

    export interface Interface006 {
      something: any;
      getAny(): any;
    }

    interface Interface007 {
      new (): Interface006;
    }

    export type { Interface007 };

    export interface Interface008<T> {}

    export interface Interface009<T extends object, U, V extends keyof T>
      extends Interface001,
        Interface002 {}

    /** @internal */
    export interface Interface010 {}

    export interface Interface011 {
      foo: string;

      /** @internal */
      bar: number;

      baz: boolean;
    }

    export interface Interface012 {
      foo?(a: number): string;
    }

    export interface Interface013 {
      /** @internal */
      new (): Interface006;

      /** @internal */
      someMethod()

      /** @internal */
      (a: string): string;

      /** @internal */
      readonly [index: string]: any;

      /** @internal */
      get foo(): any;

      /** @internal */
      set foo(value: any);
    }

    export interface Interface014 {
      /** This is a get accessor */
      get foo(): any;

      /** This is a set accessor */
      set foo(value: any);
    }

    export interface Interface015 {
      (a: string): string;
      (a: number): number;
      (a: boolean): boolean;
    }

    export interface Interface016 {
      new (): Interface006;
      new (): Interface006;
    }

    export interface Interface017 {
      readonly [index: string]: any;
      readonly [index: number]: any;
    }
    `,
  );
  project.createSourceFile(
    "internal.ts",
    dedent`
    export interface SomeType {}
    `,
  );
  project.createSourceFile(
    "namespaces.ts",
    dedent`
    /**
     * Namespace1.
     */
    export namespace Namespace1 {}

    export namespace Namespace2 {
      /** Var1 */
      export const var1 = 1;

      export namespace Namespace21 {
        export const var2 = "";

        export namespace Namespace22 {}
      }
    }

    namespace Namespace3 {
      export const var1 = 1;
    }

    namespace Namespace3 {
      export const var2 = "";
    }

    export { Namespace3 };

    /** @internal */
    export namespace Namespace4 {}
    `,
  );
  project.createSourceFile(
    "type-aliases.ts",
    dedent`
    /**
     * TypeAlias1 aliases a function.
     */
    export type TypeAlias1 = () => any;

    export type TypeAlias2 = string;

    type TypeAlias3 = number | string;

    export type { TypeAlias3 };

    /** @internal */
    export type TypeAlias4 = string;
    `,
  );
  project.createSourceFile(
    "variables.ts",
    dedent`
    import type { SomeType } from "./internal";

    export const var4 = "last variable";

    /**
     * This is var1.
     */
    export const var1 = "first variable";

    export let var2 = 2;

    export var var3 = ["one", 2, "three"];

    /**
     * This is an internal variable.
     *
     * @internal
     */
    export const var5 = "hidden";

    export const var6: SomeType = {};

    export let var7: string;
    `,
  );
  const indexFile = project.createSourceFile(
    "index.ts",
    dedent`
    /**
     * This is the overview.
     *
     * @packageDocumentation
     */

    export * from "./classes";
    export * from "./enums";
    export * from "./functions";
    export * from "./interfaces";
    export * from "./namespaces";
    export * from "./type-aliases";
    export * from "./variables";
    `,
  );
  expect(
    await extractDeclarations({
      containerName: "",
      container: indexFile,
      maxDepth: 5,
      project,
    }),
  ).toMatchSnapshot();
});
