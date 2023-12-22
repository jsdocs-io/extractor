import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { changeDir, currentDir } from "./process";

test("current directory", () => {
  expect(currentDir().isOk()).toBe(true);
});

test("change directory", async () => {
  await temporaryDirectoryTask(async (dir) => {
    expect(changeDir(dir).isOk()).toBe(true);
  });
});
