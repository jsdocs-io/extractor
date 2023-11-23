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
