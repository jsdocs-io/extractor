import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("tinyargs@0.1.4", async () => {
	expect(
		await getPackageApi({
			pkg: "tinyargs@0.1.4",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
