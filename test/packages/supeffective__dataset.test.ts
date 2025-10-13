import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts";

test("@supeffective/dataset@2.2.2", async () => {
	expect(
		await extractPackageApi({
			pkg: "@supeffective/dataset@2.2.2",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
