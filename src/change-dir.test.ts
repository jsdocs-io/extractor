import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { changeDir } from "./change-dir";

test("change directory", async () => {
  await temporaryDirectoryTask(async (dir) => {
    expect(changeDir(dir).isOk()).toBe(true);
  });
});
