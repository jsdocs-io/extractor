import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { removeDir } from "./remove-dir";

test("remove directory", async () => {
  await temporaryDirectoryTask(async (dir) => {
    expect((await removeDir(dir)).isOk()).toBe(true);
  });
});
