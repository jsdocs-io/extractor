import { expect, test } from "vitest";
import { PackageTypesError } from "./errors";
import { resolveTypes } from "./resolve-types";

test("no types", () => {
  expect(resolveTypes({}, ".").isErr()).toBe(true);
  expect(
    resolveTypes({}, ".")._unsafeUnwrapErr() instanceof PackageTypesError,
  ).toBe(true);
});

test("not types", () => {
  expect(resolveTypes({ types: "foo.wrong" }, ".").isErr()).toBe(true);
});

test("no subpath", () => {
  expect(
    resolveTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
        },
      },
      "custom",
    ).isErr(),
  ).toBe(true);
});

test("from exports", () => {
  expect(
    resolveTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
        },
      },
      ".",
    )._unsafeUnwrap(),
  ).toBe("index.d.ts");
});

test("from exports subpath", () => {
  expect(
    resolveTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
          "./custom": { types: "custom.d.ts" },
        },
      },
      "custom",
    )._unsafeUnwrap(),
  ).toBe("custom.d.ts");
});

test("from types", () => {
  expect(resolveTypes({ types: "index.d.ts" }, ".")._unsafeUnwrap()).toBe(
    "index.d.ts",
  );
});

test("from typings", () => {
  expect(resolveTypes({ typings: "index.d.ts" }, ".")._unsafeUnwrap()).toBe(
    "index.d.ts",
  );
});

test("not from default", () => {
  expect(
    resolveTypes(
      {
        name: "foo",
        types: "index.d.ts",
        exports: {
          ".": { default: "index.js" },
        },
      },
      ".",
    )._unsafeUnwrap(),
  ).toBe("index.d.ts");
});

test("not from types if no subpath", () => {
  expect(
    resolveTypes(
      {
        name: "foo",
        types: "index.d.ts",
        exports: {
          ".": { default: "index.js" },
        },
      },
      "custom",
    ).isErr(),
  ).toBe(true);
});
