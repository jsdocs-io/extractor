import { Effect } from "effect";
import fs from "node:fs/promises";
import { join } from "pathe";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { packageJson } from "./package-json";

const _packageJson = (pkgDir: string) => Effect.runPromise(packageJson(pkgDir));

test("no package.json", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await expect(_packageJson(dir)).rejects.toThrow();
	});
});

test("with package.json", async () => {
	await temporaryDirectoryTask(async (dir) => {
		await fs.writeFile(
			join(dir, "package.json"),
			'{ "name": "foo", "version": "1.0.0" }',
		);
		await expect(_packageJson(dir)).resolves.toMatchInlineSnapshot(`
      {
        "_id": "foo@1.0.0",
        "name": "foo",
        "readme": "ERROR: No README data found!",
        "version": "1.0.0",
      }
    `);
	});
});
