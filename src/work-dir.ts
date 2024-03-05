import { Effect } from "effect";
import { rm } from "node:fs/promises";
import { temporaryDirectory } from "tempy";

/** @internal */
export type WorkDir = {
  readonly path: string;
  readonly close: () => Promise<void>;
};

/** @internal */
export class WorkDirError {
  readonly _tag = "WorkDirError";
  constructor(readonly cause?: unknown) {}
}

const acquire = Effect.try({
  try: () => {
    const path = temporaryDirectory();
    return {
      path,
      close: async () => {
        try {
          await rm(path, { force: true, recursive: true, maxRetries: 3 });
        } catch {}
      },
    };
  },
  catch: (e) => new WorkDirError(e),
});

const release = (workDir: WorkDir) => Effect.promise(() => workDir.close());

/** @internal */
export const workDir = Effect.acquireRelease(acquire, release);
