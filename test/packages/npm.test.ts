import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("npm@11.4.0", async () => {
	expect(
		await getPackageApi({
			pkg: "npm@11.4.0",
		}),
	).rejects.toThrow();
});

test("@types/npm@7.19.3", async () => {
	expect(
		await getPackageApi({
			pkg: "@types/npm@7.19.3",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
