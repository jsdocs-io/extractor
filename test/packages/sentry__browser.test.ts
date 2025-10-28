import { expect, test } from "vitest";
import { getPackageApi } from "../../src/get-package-api.ts";

test("@sentry/browser@7.100.1", async () => {
	expect(
		await getPackageApi({
			pkg: "@sentry/browser@7.100.1",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		dependencies: expect.any(Array),
	});
});
