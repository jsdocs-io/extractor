import { expect, test } from "vitest";
import { extractPackageApi } from "../../src/extract-package-api.ts"

test("@sentry/browser@7.100.1", async () => {
	expect(
		await extractPackageApi({
			pkg: "@sentry/browser@7.100.1",
		}),
	).toMatchSnapshot({
		analyzedAt: expect.any(String),
		analyzedIn: expect.any(Number),
		packages: expect.any(Array),
	});
});
