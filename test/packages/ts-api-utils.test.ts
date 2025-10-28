import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("ts-api-utils@2.1.0", async () => {
	expect(
		await getPackageApi({
			pkg: "ts-api-utils@2.1.0",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
