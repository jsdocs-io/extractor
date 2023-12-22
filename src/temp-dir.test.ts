import { expect, test } from "vitest";
import { tempDir } from "./temp-dir";

test("create temporary directory", () => {
  expect(tempDir().isOk()).toBe(true);
});
