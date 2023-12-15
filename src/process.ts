import { Result } from "neverthrow";

export const currentDir = Result.fromThrowable(
  process.cwd,
  (e) => new Error(`currentDir: failed to get current directory: ${e}`),
);

export const changeDir = Result.fromThrowable(
  process.chdir,
  (e) => new Error(`changeDir: failed to change directory: ${e}`),
);
