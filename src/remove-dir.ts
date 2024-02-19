import { ResultAsync } from "neverthrow";
import fs from "node:fs/promises";
import { FsError } from "./errors";

export const removeDir = (path: string): ResultAsync<void, FsError> =>
  ResultAsync.fromPromise(
    fs.rm(path, { force: true, recursive: true, maxRetries: 3 }),
    (e) => new FsError("failed to remove directory", { cause: e }),
  );
