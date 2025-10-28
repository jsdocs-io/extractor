import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("bundle-require@4.0.2", async () => {
	expect(
		await getPackageApi({
			pkg: "bundle-require@4.0.2",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
