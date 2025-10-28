import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("faastjs@8.0.64", async () => {
	expect(
		await getPackageApi({
			pkg: "faastjs@8.0.64",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
