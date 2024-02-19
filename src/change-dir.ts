import { Result } from "neverthrow";
import { OsError } from "./errors";

export const changeDir = Result.fromThrowable(
  process.chdir,
  (e) => new OsError("failed to change directory", { cause: e }),
);
