import { expect, test } from "vitest";
import { extractPackageApi } from "../../src";

test("@storylite/storylite@0.14.0", async () => {
	expect(
		await extractPackageApi({
			pkg: "@storylite/storylite@0.14.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
