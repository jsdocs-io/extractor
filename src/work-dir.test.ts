import { Effect } from "effect";
import { rm } from "node:fs/promises";
import { join } from "pathe";
import { temporaryDirectory, temporaryDirectoryTask } from "tempy";
import { afterEach, expect, test, vi } from "vitest";
import { workDir } from "./work-dir.ts";

function _workDir() {
	return Effect.runPromise(
		Effect.gen(function* () {
			const { path } = yield* workDir;
			return path;
		}).pipe(Effect.scoped),
	);
}

vi.mock("tempy", async (importOriginal) => {
	const actual: any = await importOriginal();
	return { ...actual, temporaryDirectory: vi.fn() };
});

vi.mock("node:fs/promises", async () => {
	return { rm: vi.fn() };
});

afterEach(() => {
	vi.clearAllMocks();
});

test("work dirs", async () => {
	await temporaryDirectoryTask(async (dir) => {
		const dir1 = join(dir, "dir1");
		const dir2 = join(dir, "dir2");
		const dir3 = join(dir, "dir3");
		vi.mocked(temporaryDirectory)
			.mockReturnValueOnce(dir1)
			.mockReturnValueOnce(dir2)
			.mockReturnValueOnce(dir3)
			.mockImplementationOnce(() => {
				// Fail acquire on 4th call.
				throw new Error("test");
			});
		vi.mocked(rm)
			.mockImplementationOnce(async () => {})
			.mockImplementationOnce(async () => {})
			.mockImplementationOnce(() => {
				// Fail release on 3rd call.
				throw new Error("test");
			})
			.mockImplementationOnce(async () => {});
		await expect(_workDir()).resolves.toBe(dir1);
		await expect(_workDir()).resolves.toBe(dir2);
		await expect(_workDir()).resolves.toBe(dir3);
		await expect(_workDir()).rejects.toThrow();
	});
});
