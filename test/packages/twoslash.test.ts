import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("twoslash@0.2.1", async () => {
	expect(
		await getPackageApi({
			pkg: "twoslash@0.2.1",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
