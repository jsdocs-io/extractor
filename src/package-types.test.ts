import { Effect } from "effect";
import type { NormalizedPackageJson } from "read-pkg";
import { expect, test } from "vitest";
import { packageTypes } from "./package-types";

const _packageTypes = (
  pkgJson: Partial<NormalizedPackageJson>,
  subpath: string,
) => Effect.runPromise(packageTypes(pkgJson, subpath));

test("no types", async () => {
  await expect(_packageTypes({}, ".")).rejects.toThrow();
});

test("not type definitions file", async () => {
  await expect(_packageTypes({ types: "foo.wrong" }, ".")).rejects.toThrow();
});

test("`default` subpath not found", async () => {
  await expect(
    _packageTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
        },
      },
      "default",
    ),
  ).rejects.toThrow();
});

test("`custom` subpath not found", async () => {
  await expect(
    _packageTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
        },
      },
      "custom",
    ),
  ).rejects.toThrow();
});

test("types from exports for root `.` subpath", async () => {
  await expect(
    _packageTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
        },
      },
      ".",
    ),
  ).resolves.toBe("index.d.ts");
});

test("types from exports for root `foo` subpath", async () => {
  await expect(
    _packageTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
        },
      },
      "foo",
    ),
  ).resolves.toBe("index.d.ts");
});

test("types from `custom` subpath", async () => {
  await expect(
    _packageTypes(
      {
        name: "foo",
        exports: {
          ".": { types: "index.d.ts" },
          "./custom": { types: "custom.d.ts" },
        },
      },
      "custom",
    ),
  ).resolves.toBe("custom.d.ts");
});

test("types from `types` fallback", async () => {
  await expect(_packageTypes({ types: "index.d.ts" }, ".")).resolves.toBe(
    "index.d.ts",
  );
});

test("types from `typings` fallback", async () => {
  await expect(_packageTypes({ typings: "index.d.ts" }, ".")).resolves.toBe(
    "index.d.ts",
  );
});

test("types from `types` fallback and not from default condition for root subpath", async () => {
  await expect(
    _packageTypes(
      {
        name: "foo",
        types: "index.d.ts",
        exports: {
          ".": { default: "index.js" },
        },
      },
      ".",
    ),
  ).resolves.toBe("index.d.ts");
});

test("types not from `types` fallback if not root subpath", async () => {
  await expect(
    _packageTypes(
      {
        name: "foo",
        types: "index.d.ts",
        exports: {
          ".": { default: "index.js" },
        },
      },
      "custom",
    ),
  ).rejects.toThrow();
});

test("types not from `typings` fallback if not root subpath", async () => {
  await expect(
    _packageTypes(
      {
        name: "foo",
        typings: "index.d.ts",
        exports: {
          ".": { default: "index.js" },
        },
      },
      "custom",
    ),
  ).rejects.toThrow();
});
