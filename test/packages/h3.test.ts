import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts";

test("h3@1.10.1", async () => {
	expect(
		await extractPackageApi({
			pkg: "h3@1.10.1",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
