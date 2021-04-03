/** Class1 */
export class Class1 {
    // ECMAScript Private Field
    // See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#ecmascript-private-fields
    #foo: string;

    bar: number;

    qux() {
        return `${this.#foo} or ${this.bar}`;
    }
}
