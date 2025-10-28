import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("@storylite/storylite@0.14.0", async () => {
	expect(
		await getPackageApi({
			pkg: "@storylite/storylite@0.14.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
