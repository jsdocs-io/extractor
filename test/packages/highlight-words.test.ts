import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("highlight-words@1.2.2", async () => {
	expect(
		await getPackageApi({
			pkg: "highlight-words@1.2.2",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
