import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("@microsoft/api-extractor@7.13.0", async () => {
	expect(
		await getPackageApi({
			pkg: "@microsoft/api-extractor@7.13.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
