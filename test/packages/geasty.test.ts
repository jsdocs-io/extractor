import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts"

test("geasty@0.0.6", async () => {
	expect(
		await extractPackageApi({
			pkg: "geasty@0.0.6",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
