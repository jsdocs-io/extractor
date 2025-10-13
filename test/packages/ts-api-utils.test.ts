import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts"

test("ts-api-utils@2.1.0", async () => {
	expect(
		await extractPackageApi({
			pkg: "ts-api-utils@2.1.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
