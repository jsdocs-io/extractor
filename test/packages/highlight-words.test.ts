import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts";

test("highlight-words@1.2.2", async () => {
	expect(
		await extractPackageApi({
			pkg: "highlight-words@1.2.2",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
