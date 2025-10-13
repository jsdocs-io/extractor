import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts";

test("faastjs@8.0.64", async () => {
	expect(
		await extractPackageApi({
			pkg: "faastjs@8.0.64",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
