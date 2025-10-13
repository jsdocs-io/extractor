import { Effect } from "effect";
import { temporaryDirectoryTask } from "tempy";
import { expect, test } from "vitest";
import { bunPackageManager } from "./bun-package-manager.ts";
import type { InstallPackageOptions } from "./package-manager.ts";

const bun = bunPackageManager();

const _installPackage = (options: InstallPackageOptions) =>
	Effect.runPromise(bun.installPackage(options));

test("invalid package", async () => {
	await temporaryDirectoryTask(async (cwd) => {
		await expect(_installPackage({ pkg: "", cwd })).rejects.toThrow();
	});
});

test("package with no production dependencies", async () => {
	await temporaryDirectoryTask(async (cwd) => {
		await expect(_installPackage({ pkg: "verify-hcaptcha@1.0.0", cwd })).resolves.toStrictEqual([
			"verify-hcaptcha@1.0.0",
		]);
	});
});

test("package with some production dependencies", async () => {
	await temporaryDirectoryTask(async (cwd) => {
		await expect(_installPackage({ pkg: "query-registry@2.6.0", cwd })).resolves.toContain(
			"query-registry@2.6.0",
		);
	});
});
