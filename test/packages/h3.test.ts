import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("h3@1.10.1", async () => {
	expect(
		await getPackageApi({
			pkg: "h3@1.10.1",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
