import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("magicast@0.3.3", async () => {
	expect(
		await getPackageApi({
			pkg: "magicast@0.3.3",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
