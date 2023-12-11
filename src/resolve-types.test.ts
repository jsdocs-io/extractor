import { expect, test } from "vitest";
import { resolveTypes } from "./resolve-types";

test("no types", () => {
  expect(resolveTypes({}, ".")).toBeUndefined();
});

test("not types", () => {
  expect(resolveTypes({ types: "foo.wrong" }, ".")).toBeUndefined();
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
    ),
  ).toBeUndefined();
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
    ),
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
    ),
  ).toBe("custom.d.ts");
});

test("from types", () => {
  expect(resolveTypes({ types: "index.d.ts" }, ".")).toBe("index.d.ts");
});

test("from typings", () => {
  expect(resolveTypes({ typings: "index.d.ts" }, ".")).toBe("index.d.ts");
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
    ),
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
    ),
  ).toBeUndefined();
});
