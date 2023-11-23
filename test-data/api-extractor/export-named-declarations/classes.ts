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

export class Class007<T extends object, U, V extends keyof T> extends Class003
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
    private static qux = 'qux';

    /** Foo */
    static readonly foo = 'foo';

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
        return '';
    }
}

export class Class012 {
    private qux = 'qux';

    /** Foo */
    readonly foo = 'foo';

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
        return '';
    }
}

export class Class013 {
    constructor(
        /** Foo */
        readonly foo: string = 'foo',
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
    static foo = 'foo';

    // Starts with underscore
    _quux:string;

    /** @internal */
    constructor() {
        this._quux = 'quux';
        this.bar = 0;
    }

    /** @internal */
    bar: number;

    /** @internal */
    baz() {}
}
