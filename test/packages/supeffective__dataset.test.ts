import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("@supeffective/dataset@2.2.2", async () => {
	expect(
		await getPackageApi({
			pkg: "@supeffective/dataset@2.2.2",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
