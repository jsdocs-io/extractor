import { expect, test } from "vitest";
import { nameFromPackage } from "./name-from-package";

test("bare package name", () => {
  expect(nameFromPackage("foo")).toBe("foo");
});

test("bare package name with version", () => {
  expect(nameFromPackage("foo@1.0.0")).toBe("foo");
});

test("bare package name with range", () => {
  expect(nameFromPackage("foo@^1")).toBe("foo");
});

test("bare package name with tag", () => {
  expect(nameFromPackage("foo@latest")).toBe("foo");
});

test("scoped package name", () => {
  expect(nameFromPackage("@foo/bar")).toBe("@foo/bar");
});

test("scoped package name with version", () => {
  expect(nameFromPackage("@foo/bar@1.0.0")).toBe("@foo/bar");
});

test("scoped package name with range", () => {
  expect(nameFromPackage("@foo/bar@^1")).toBe("@foo/bar");
});

test("scoped package name with tag", () => {
  expect(nameFromPackage("@foo/bar@latest")).toBe("@foo/bar");
});
