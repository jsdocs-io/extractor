import { ok } from "neverthrow";
import { expect, test } from "vitest";
import { InvalidPackageNameError } from "./errors";
import { packageName } from "./package-name";

test("no name", () => {
  expect(packageName("").isErr()).toBe(true);
  expect(
    packageName("")._unsafeUnwrapErr() instanceof InvalidPackageNameError,
  ).toBe(true);
});

test("no name with version", () => {
  expect(packageName("@1.0.0").isErr()).toBe(true);
});

test("invalid name", () => {
  expect(packageName("!").isErr()).toBe(true);
});

test("invalid name with version", () => {
  expect(packageName("!@1.0.0").isErr()).toBe(true);
});

test("bare package name", () => {
  expect(packageName("foo")).toStrictEqual(ok("foo"));
});

test("bare package name with version", () => {
  expect(packageName("foo@1.0.0")).toStrictEqual(ok("foo"));
});

test("bare package name with range", () => {
  expect(packageName("foo@^1")).toStrictEqual(ok("foo"));
});

test("bare package name with tag", () => {
  expect(packageName("foo@latest")).toStrictEqual(ok("foo"));
});

test("scoped package name", () => {
  expect(packageName("@foo/bar")).toStrictEqual(ok("@foo/bar"));
});

test("scoped package name with version", () => {
  expect(packageName("@foo/bar@1.0.0")).toStrictEqual(ok("@foo/bar"));
});

test("scoped package name with range", () => {
  expect(packageName("@foo/bar@^1")).toStrictEqual(ok("@foo/bar"));
});

test("scoped package name with tag", () => {
  expect(packageName("@foo/bar@latest")).toStrictEqual(ok("@foo/bar"));
});
