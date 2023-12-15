import { Result } from "neverthrow";
import { temporaryDirectory } from "tempy";

export const tempDir = Result.fromThrowable(
  temporaryDirectory,
  (e) => new Error(`tempDir: failed to create temporary directory: ${e}`),
);
