import { expect, test } from "vitest";
import { nameOfPackage } from "./name-of-package";

test("bare package name", () => {
  expect(nameOfPackage("foo")).toBe("foo");
});

test("bare package name with version", () => {
  expect(nameOfPackage("foo@1.0.0")).toBe("foo");
});

test("bare package name with range", () => {
  expect(nameOfPackage("foo@^1")).toBe("foo");
});

test("bare package name with tag", () => {
  expect(nameOfPackage("foo@latest")).toBe("foo");
});

test("scoped package name", () => {
  expect(nameOfPackage("@foo/bar")).toBe("@foo/bar");
});

test("scoped package name with version", () => {
  expect(nameOfPackage("@foo/bar@1.0.0")).toBe("@foo/bar");
});

test("scoped package name with range", () => {
  expect(nameOfPackage("@foo/bar@^1")).toBe("@foo/bar");
});

test("scoped package name with tag", () => {
  expect(nameOfPackage("@foo/bar@latest")).toBe("@foo/bar");
});
