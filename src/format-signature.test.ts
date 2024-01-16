import { expect, test } from "vitest";
import { formatSignature } from "./format-signature";

test("format signature", async () => {
  const tests = [
    ["variable", "const foo: string", "const foo: string;"],
    ["function", "foo: () => string", "foo: () => string;"],
    ["class", "class Foo {}", "class Foo {}"],
    ["interface", "interface Foo {}", "interface Foo {}"],
    ["enum", "enum Foo {}", "enum Foo {}"],
    ["class-constructor", "constructor() {}", "constructor() {}"],
    ["interface-property", "foo: string", "foo: string;"],
  ] as const;
  for (const tc of tests) {
    expect(await formatSignature(tc[0], tc[1])).toBe(tc[2]);
  }
});

test("formatting error", async () => {
  expect(await formatSignature("variable", "{")).toBe("{");
});
