import { expect, test } from "vitest";
import { id } from "./id";

test("no parts", () => {
  expect(id()).toBe("");
});

test("one part", () => {
  expect(id("foo")).toBe("foo");
});

test("multiple parts", () => {
  expect(id("foo", "bar", "baz")).toBe("foo.bar.baz");
});

test("multiple parts and empty parts", () => {
  expect(id("foo", "", "bar", "", "baz")).toBe("foo.bar.baz");
});
