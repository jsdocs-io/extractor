import { Result } from "neverthrow";
import { OsError } from "./errors";

export const currentDir = Result.fromThrowable(
  process.cwd,
  (e) => new OsError("failed to get current directory", { cause: e }),
);
