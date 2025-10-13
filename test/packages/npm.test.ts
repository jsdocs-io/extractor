import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts";

test("npm@11.4.0", async () => {
	await expect(
		extractPackageApi({
			pkg: "npm@11.4.0",
		}),
	).rejects.toThrow();
});

test("@types/npm@7.19.3", async () => {
	expect(
		await extractPackageApi({
			pkg: "@types/npm@7.19.3",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
