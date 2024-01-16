import { expect, test } from "vitest";
import { FsError, OsError } from "./errors";

test("os error", () => {
  expect(() => {
    throw new OsError("test");
  }).toThrow();
});

test("fs error", () => {
  expect(() => {
    throw new FsError("test");
  }).toThrow();
});
