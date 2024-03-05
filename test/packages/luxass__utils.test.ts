import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("@luxass/utils@1.1.0", async () => {
	expect(
		await extractPackageApi({
			pkg: "@luxass/utils@1.1.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
