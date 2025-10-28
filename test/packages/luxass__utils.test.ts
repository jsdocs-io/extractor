import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("@luxass/utils@1.1.0", async () => {
	expect(
		await getPackageApi({
			pkg: "@luxass/utils@1.1.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
