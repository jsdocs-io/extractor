import { Effect } from "effect";
import { rm } from "node:fs/promises";
import { temporaryDirectory } from "tempy";
import { WorkDirError } from "./errors.ts";
import type { WorkDir } from "./types.ts";

/** `workDir` is an Effect resource that represents a temporary directory. */
export const workDir = Effect.acquireRelease(
	Effect.try({
		try: (): WorkDir => {
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
		catch: (err) => new WorkDirError({ cause: err }),
	}),
	(workDir: WorkDir) => Effect.promise(() => workDir.close()),
);
