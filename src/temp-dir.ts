import { Result } from "neverthrow";
import { temporaryDirectory } from "tempy";
import { FsError } from "./errors";

export const tempDir = Result.fromThrowable(
  temporaryDirectory,
  (e) => new FsError("failed to create temporary directory", { cause: e }),
);
