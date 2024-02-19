import { expect, test } from "vitest";
import { currentDir } from "./current-dir";

test("current directory", () => {
  expect(currentDir().isOk()).toBe(true);
});
