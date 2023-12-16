import { ok } from "neverthrow";
import { expect, test } from "vitest";
import { PackageTypesError } from "./errors";
import { packageTypes } from "./package-types";

test("no types", () => {
  expect(packageTypes({}, ".").isErr()).toBe(true);
  expect(
    packageTypes({}, ".")._unsafeUnwrapErr() instanceof PackageTypesError,
  ).toBe(true);
});

test("not types", () => {
  expect(packageTypes({ types: "foo.wrong" }, ".").isErr()).toBe(true);
});

test("no subpath", () => {
  expect(
    packageTypes(
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
    packageTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
        },
      },
      ".",
    ),
  ).toStrictEqual(ok("index.d.ts"));
});

test("from exports subpath", () => {
  expect(
    packageTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
          "./custom": { types: "custom.d.ts" },
        },
      },
      "custom",
    ),
  ).toStrictEqual(ok("custom.d.ts"));
});

test("from types", () => {
  expect(packageTypes({ types: "index.d.ts" }, ".")).toStrictEqual(
    ok("index.d.ts"),
  );
});

test("from typings", () => {
  expect(packageTypes({ typings: "index.d.ts" }, ".")).toStrictEqual(
    ok("index.d.ts"),
  );
});

test("not from default", () => {
  expect(
    packageTypes(
      {
        name: "foo",
        types: "index.d.ts",
        exports: {
          ".": { default: "index.js" },
        },
      },
      ".",
    ),
  ).toStrictEqual(ok("index.d.ts"));
});

test("not from types if no subpath", () => {
  expect(
    packageTypes(
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
