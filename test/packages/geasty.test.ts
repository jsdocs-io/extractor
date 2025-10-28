import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("geasty@0.0.6", async () => {
	expect(
		await getPackageApi({
			pkg: "geasty@0.0.6",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
